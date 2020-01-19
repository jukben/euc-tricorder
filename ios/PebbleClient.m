//
//  PebbleClient.m
//  euctricorder
//
//  Created by Jakub Benes on 19/01/2020.
//

#import "PebbleClient.h"

typedef NS_ENUM(NSUInteger, AppMessageKey) {
    Speed = 0,
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
    return @[@"PebbleConnected", @"PebbleConnected"];
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
    _central.delegate = self;
}

RCT_EXPORT_METHOD(destroy) {
    _central = nil;
}

RCT_EXPORT_METHOD(run) {
    [_central run];
}

RCT_EXPORT_METHOD(sendUpdate:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  if (!self.connectedWatch){
    NSError *error = [[NSError alloc] initWithDomain:NSPOSIXErrorDomain
    code:errno userInfo:nil];
     
    NSLog(@"Watch is not connected");
    reject(@"not_sent", @"Watch is not connected", error);
  }
  
  NSDictionary *update = @{ @(0):[NSNumber pb_numberWithUint8:42] };
  [self.connectedWatch appMessagesPushUpdate:update onSent:^(PBWatch *watch, NSDictionary *update, NSError *error) {
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
}

- (void)pebbleCentral:(PBPebbleCentral *)central watchDidDisconnect:(PBWatch *)watch {
  NSLog(@"Pebble disconnected: %@", watch.name);
  // If this was the recently connected watch, forget it
  if ([watch isEqual:self.connectedWatch]) {
    self.connectedWatch = nil;
    [self sendEventWithName:@"PebbleConnected" body:@{@"name": watch.name}];
  }
}

@end
