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

@property (weak, nonatomic) PBPebbleCentral* central;
@property (weak, nonatomic) PBWatch *connectedWatch;

@end
