//
//  FlicClient.m
//  euctricorder
//
//  Created by Jakub Benes on 19/01/2020.
//

#import "FlicClient.h"
#import <React/RCTConvert.h>


@implementation FlicClient
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
    return @[@"FlicConnected", @"FlicDisconnected", @"FlicAction"];
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
    
    return self;
}

- (void)invalidate {
  [self destroy];
}


RCT_EXPORT_METHOD(configure:(NSString*)appID:(NSString*)appSecret) {
  [SCLFlicManager configureWithDelegate:self defaultButtonDelegate:self appID:appID appSecret:appSecret backgroundExecution:YES];
}

RCT_EXPORT_METHOD(grabButton) {
  [[SCLFlicManager sharedManager] grabFlicFromFlicAppWithCallbackUrlScheme:@"euctricorder"];
}


RCT_EXPORT_METHOD(destroy) {
}

+ (BOOL)handleOpenURL:(NSURL *)url {
  return [[SCLFlicManager sharedManager] handleOpenURL:url];
}

// -- SCLFlicButtonDelegate --

- (void) flicButton:(SCLFlicButton *)button didReceiveButtonClick:(BOOL)queued age:(NSInteger)age{
  [self dispatchEvent:@"FlicAction" value:@"click"];
}

- (void) flicButton:(SCLFlicButton *)button didReceiveButtonHold:(BOOL)queued age:(NSInteger)age{
  [self dispatchEvent:@"FlicAction" value:@"hold"];
}

- (void)flicButtonDidConnect:(SCLFlicButton *)button{
  [self dispatchEvent:@"FlicConnected" value:@{@"name": button.name}];
}

- (void)flicManagerDidRestoreState:(SCLFlicManager *)manager{
  NSLog(@"Flic: restore %@", manager.knownButtons);
  
  NSDictionary *connectedFlic = manager.knownButtons;

  for (id flic in connectedFlic) {
    SCLFlicButton *button =  [connectedFlic objectForKey:flic];
    
    [self dispatchEvent:@"FlicConnected" value:@{@"name": button.name}];
  }
}

- (void) flicManager:(SCLFlicManager *)manager didGrabFlicButton:(SCLFlicButton *)button withError:(NSError *)error; {
  if (error) {
    NSLog(@"Flic: Could not grab: %@", error);
    return;
  }
  
  NSLog(@"Flic: Grabbed button!");
}


@end
