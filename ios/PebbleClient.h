//
//  PebbleClient.h
//  euctricorder
//
//  Created by Jakub Benes on 19/01/2020.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <PebbleKit/PebbleKit.h>

@interface PebbleClient : RCTEventEmitter <RCTBridgeModule, PBPebbleCentralDelegate>

+ (void)applicationWillTerminate;
- (void)dispatchEvent:(NSString * _Nonnull)name value:(id _Nonnull)value;

@property (weak, nonatomic) PBPebbleCentral* _Nullable central;
@property (weak, nonatomic) PBWatch * _Nullable connectedWatch;

@end
