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
    KeyButtonUp = 0,
    KeyButtonDown
};

// Game result values
typedef NS_ENUM(NSUInteger, Data) {
    Speed = 0,
    Battery,
    Temperature
};

@implementation PebbleClient
{
    bool hasListeners;
}

@synthesize methodQueue = _methodQueue;

RCT_EXPORT_MODULE();

//- (void)dispatchEvent:(NSString * _Nonnull)name value:(id _Nonnull)value {
//    if (hasListeners) {
//        [self sendEventWithName:name body:value];
//    }
//}
//
//- (void)startObserving {
//    hasListeners = YES;
//}
//
//- (void)stopObserving {
//    hasListeners = NO;
//}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"PebbleConnected", @"PebbleDisconnected"];
}


+ (BOOL)requiresMainQueueSetup {
    return YES;
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(configure:(NSString*)appUUID) {
    NSUUID *uuid = [[NSUUID alloc] initWithUUIDString:appUUID];
    _central = [PBPebbleCentral defaultCentral];
    _central.appUUID = uuid;
    [_central run];
    _central.delegate = self;
}

RCT_EXPORT_METHOD(destroy) {
    _central = nil;
}

RCT_EXPORT_METHOD(run) {
    //[_central run];
}

RCT_EXPORT_METHOD(sendUpdate:(NSDictionary *)data:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSNumber *speed = [RCTConvert NSNumber:data[@"speed"]];
  
  if (!self.connectedWatch){
    NSError *error = [[NSError alloc] initWithDomain:NSPOSIXErrorDomain
    code:errno userInfo:nil];

    NSLog(@"Watch is not connected");
    reject(@"not_sent", @"Watch is not connected", error);
  }

  NSMutableDictionary *outgoing = [NSMutableDictionary new];
  
  outgoing[@(Speed)] = [NSNumber pb_numberWithInt8:speed.pb_uint8Value];
  
  [self.connectedWatch appMessagesPushUpdate:outgoing onSent:^(PBWatch *watch, NSDictionary *update, NSError *error) {
    if (!error) {
      NSLog(@"Successfully sent message.");
      resolve(@YES);
    } else {
      NSLog(@"Error sending message: %@", error);
      reject(@"not_sent", @"Update wasn't sent", error);
    }
  }];
}

- (void)invalidate {
    [self destroy];
}

- (void)pebbleCentral:(PBPebbleCentral *)central watchDidConnect:(PBWatch *)watch isNew:(BOOL)isNew {
  NSLog(@"Pebble connected: %@", watch.name);
  // Keep a reference to this watch
  self.connectedWatch = watch;
  [self sendEventWithName:@"PebbleConnected" body:@{@"name": watch.name}];
  
  // Keep a weak reference to self to prevent it staying around forever
  __weak typeof(self) welf = self;
  
  // need to send arbitrary data to watch before it can send to us
  NSNumber *arbitraryNumber = [NSNumber pb_numberWithUint8:0];
  NSDictionary *update = @{ @(0):arbitraryNumber };
  [self.connectedWatch appMessagesPushUpdate:update onSent:^(PBWatch *watch,
                                                    NSDictionary *update, NSError *error) {
      if (!error) { 
          NSLog(@"Successfully sent message.");
      } else {
          NSLog(@"Error sending message: %@", error);
      }
  }];

  
  // Sign up for AppMessage
  [self.connectedWatch appMessagesAddReceiveUpdateHandler:^BOOL(PBWatch *watch, NSDictionary *update) {
      __strong typeof(welf) sself = welf;
      if (!sself) {
          // self has been destroyed
          return NO;
      }
      
      // Process incoming messages
      if (update[@(KeyButtonUp)]) {
        NSLog(@"KeyButtonUP");
      }
      
      if (update[@(KeyButtonDown)]) {
        NSLog(@"KeyButtonDOWN");
      }

      
      return YES;
  }];
}

- (void)pebbleCentral:(PBPebbleCentral *)central watchDidDisconnect:(PBWatch *)watch {
  NSLog(@"Pebble disconnected: %@", watch.name);
  // If this was the recently connected watch, forget it
  if ([watch isEqual:self.connectedWatch]) {
    self.connectedWatch = nil;
    [self sendEventWithName:@"PebbleDisconnected" body:@{@"name": watch.name}];
  }
}

@end
