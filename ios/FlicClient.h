//
//  FlicClient.h
//  euctricorder
//
//  Created by Jakub Benes on 19/01/2020.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <fliclib/fliclib.h>

@interface FlicClient : RCTEventEmitter <RCTBridgeModule, SCLFlicManagerDelegate, SCLFlicButtonDelegate>

+ (BOOL)handleOpenURL:(NSURL * _Nonnull) url;
- (void)dispatchEvent:(NSString * _Nonnull)name value:(id _Nonnull)value;

@end
