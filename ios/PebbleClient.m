//
//  PebbleClient.m
//  euctricorder
//
//  Created by Jakub Benes on 19/01/2020.
//

#import "PebbleClient.h"
#import <React/RCTConvert.h>

// AppMessage keys
typedef NS_ENUM(NSUInteger, AppMessageKey) {
    Ready = 0,
    KeyButtonUp,
    KeyButtonDown
};

// Game result values
typedef NS_ENUM(NSUInteger, Data) {
    Speed = 0,
    Temperature,
    Voltage,
    Battery,
    ConnectedToDevice,
    ConnectedToPhone,
    Dummy,
};

@implementation PebbleClient
{
  bool hasListeners;
}

@synthesize methodQueue = _methodQueue;

RCT_EXPORT_MODULE();

- (void)dispatchEvent:(NSString * _Nonnull)name value:(id _Nonnull)value {
    if (hasListeners) {
        [self sendEventWithName:name body:value];
    }
}

- (void)startObserving {
    hasListeners = YES;
}

- (void)stopObserving {
    hasListeners = NO;
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"PebbleConnected", @"PebbleDisconnected", @"PebbleMessage"];
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

- (instancetype)init
{
    self = [super init];

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(appDisconnected)
                                                 name:@"AppDisconnected"
                                               object:nil];

    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(messageRecieved :) name:@"PebbleMessageReceived" object:nil];
  
    return self;
}

- (void)invalidate {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
  [self destroy];
}

- (void)messageRecieved:(NSNotification*)notification {
  [self dispatchEvent:@"PebbleMessage" value:notification.userInfo];
}

- (void)appDisconnected {
  NSLog(@"Pebble: App disconnected");
  NSNumber *pebbleNotReady = [NSNumber pb_numberWithUint8:0];
  NSDictionary *update = @{ @(ConnectedToPhone):pebbleNotReady, @(ConnectedToDevice):pebbleNotReady };

  [self sendMessageToPebble:update];
}

- (void)sendMessageToPebble:(NSDictionary*)update {
  if (self.connectedWatch != nil){
    [self.connectedWatch appMessagesPushUpdate:update onSent:^(PBWatch *watch,
                                                      NSDictionary *update, NSError *error) {
        if (!error) {
            NSLog(@"Pebble: Successfully sent message.");
        } else {
            NSLog(@"Pebble: Error sending message: %@", error);
        }
    }];
  }
}

- (void)sendMessageToPebble:(NSDictionary*)update handler:(void(^)(bool, NSError *__nullable error))handler  {
  if (self.connectedWatch != nil){
    void (^completionHandler)(bool, NSError *__nullable error) = [handler copy];
    
    [self.connectedWatch appMessagesPushUpdate:update onSent:^(PBWatch *watch,
                                                      NSDictionary *update, NSError *error) {
    
        if (!error) {
          NSLog(@"Pebble: Successfully sent message.");
          completionHandler(true, error);
        } else {
          NSLog(@"Pebble: Error sending message: %@", error);
          completionHandler(false, error);
        }
    }];
  }
}

+ (void)applicationWillTerminate {
  NSLog(@"Pebble: Client is shutting down");
  [[NSNotificationCenter defaultCenter] postNotificationName:@"AppDisconnected" object:self];
}


RCT_EXPORT_METHOD(configure:(NSString*)appUUID) {
    NSUUID *uuid = [[NSUUID alloc] initWithUUIDString:appUUID];
    _central = [PBPebbleCentral defaultCentral];
    _central.appUUID = uuid;
    _central.delegate = self;
}

RCT_EXPORT_METHOD(destroy) {
  [[NSNotificationCenter defaultCenter] postNotificationName:@"AppDisconnected" object:self];
  _central = nil;
}

RCT_EXPORT_METHOD(run) {
  [_central run];
}

RCT_EXPORT_METHOD(sendUpdate:(NSDictionary *)data:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  if (self.connectedWatch == nil){
    NSError *error = [[NSError alloc] initWithDomain:NSPOSIXErrorDomain
    code:errno userInfo:nil];

    NSLog(@"Pebble: Watch is not connected");
    reject(@"not_sent", @"Watch is not connected", error);
    
    return;
  }

  NSMutableDictionary *update = [NSMutableDictionary new];
  
  if (data[@"speed"]){
    NSNumber *speed = [RCTConvert NSNumber:data[@"speed"]];
    update[@(Speed)] = [NSNumber pb_numberWithInt8:speed.pb_uint8Value];
  }
  if (data[@"battery"]){
    NSNumber *battery = [RCTConvert NSNumber:data[@"battery"]];
    update[@(Battery)] = [NSNumber pb_numberWithInt8:battery.pb_uint8Value];
  }
  if (data[@"voltage"]){
    NSNumber *voltage = [RCTConvert NSNumber:data[@"voltage"]];
    update[@(Voltage)] = [NSNumber pb_numberWithInt8:voltage.pb_uint8Value];
  }
  if (data[@"temperature"]){
    NSNumber *temperature = [RCTConvert NSNumber:data[@"temperature"]];
    update[@(Temperature)] = [NSNumber pb_numberWithInt8:temperature.pb_uint8Value];
  }
  if (data[@"connectedToDevice"]){
    NSNumber *connectedToDevice = [RCTConvert NSNumber:data[@"connectedToDevice"]];
    update[@(ConnectedToDevice)] = [NSNumber pb_numberWithInt8:connectedToDevice.pb_uint8Value];
  }
  if (data[@"connectedToPhone"]){
    NSNumber *connectedToPhone = [RCTConvert NSNumber:data[@"connectedToPhone"]];
    update[@(ConnectedToPhone)] = [NSNumber pb_numberWithInt8:connectedToPhone.pb_uint8Value];
  }
 
  NSLog(@"Pebble: Sending update %@", update);
  
  [self sendMessageToPebble:update handler:^(bool succuess, NSError *error){
    if (succuess){
      resolve(@YES);
    }else{
      NSError *error = [[NSError alloc] initWithDomain:NSPOSIXErrorDomain
      code:errno userInfo:nil];
      
      reject(@"not_sent", @"Update wasn't sent", error);
    }
  }];
}

- (void)pebbleCentral:(PBPebbleCentral *)central watchDidConnect:(PBWatch *)watch isNew:(BOOL)isNew {
  NSLog(@"Pebble connected: %@", watch.name);
  // Keep a reference to this watch
  self.connectedWatch = watch;
  [self dispatchEvent:@"PebbleConnected" value:@{@"name": watch.name}];
  
  // Keep a weak reference to self to prevent it staying around forever
  __weak typeof(self) welf = self;
  
  // send we are ready event!
  NSNumber *arbitraryEvent = [NSNumber pb_numberWithUint8:1];
  NSDictionary *update = @{ @(Dummy):arbitraryEvent };
  [self sendMessageToPebble:update];
  
  // Sign up for AppMessage
  [self.connectedWatch appMessagesAddReceiveUpdateHandler:^BOOL(PBWatch *watch, NSDictionary *update) {
      __strong typeof(welf) sself = welf;
      if (!sself) {
          // self has been destroyed
          return NO;
      }
    
      if (update[@(Ready)]) {
        NSLog(@"Pebble sent message: Ready");
        int state = [update[@(Ready)] intValue];
  
        [[NSNotificationCenter defaultCenter] postNotificationName:@"PebbleMessageReceived" object:self userInfo:@{@"name": @"Ready", @"payload":state == 1 ? @YES : @NO}];
        
        
        if (state == 1 && welf.connectedWatch == nil){
          NSLog(@"Pebble: watches resurrected");
          welf.connectedWatch = watch;
        }
      }
      
      // Process incoming messages
      if (update[@(KeyButtonUp)]) {
        NSLog(@"Pebble sent message: KeyButtonUP!");
        [[NSNotificationCenter defaultCenter] postNotificationName:@"PebbleMessageReceived" object:self userInfo:@{@"name": @"ButtonPressed", @"payload":@"up"}];

      }
      
      if (update[@(KeyButtonDown)]) {
        NSLog(@"Pebble sent message: KeyButtonDOWN!");
        [[NSNotificationCenter defaultCenter] postNotificationName:@"PebbleMessageReceived" object:self userInfo:@{@"name": @"ButtonPressed", @"payload":@"down"}];
      }
      
      return YES;
  }];
}

- (void)pebbleCentral:(PBPebbleCentral *)central watchDidDisconnect:(PBWatch *)watch {
  NSLog(@"Pebble disconnected: %@", watch.name);
  // If this was the recently connected watch, forget it
  if ([watch isEqual:self.connectedWatch]) {
    self.connectedWatch = nil;
    [self dispatchEvent:@"PebbleDisconnected" value:@{@"name": watch.name}];
  }
}

@end
