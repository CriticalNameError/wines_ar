"use strict";

import React, { Component } from "react";

import { StyleSheet } from "react-native";

import {
  ViroARScene,
  ViroMaterials,
  ViroNode,
  ViroAnimations,
  Viro3DObject,
  ViroLightingEnvironment,
  ViroARImageMarker,
  ViroARTrackingTargets,
  ViroSphere,
  ViroSpotLight,
  ViroAmbientLight,
  ViroDirectionalLight,
  ViroQuad,
  ViroARPlaneSelector,
  ViroARPlane,
  ViroBox,
  ViroConstants,
  ViroText,
} from "react-viro";

class ARWine extends Component {
  constructor() {
    super();

    // Set initial state here
    this.state = {
      modelsCounter: 0,
      modelArray: [],
      pauseUpdates: false,
      show_bottle_1: true,
      show_bottle_2: true,
      barrel: false,
    };

    // bind 'this' to functions, so state is accessible for them
    this._onInitialized = this._onInitialized.bind(this);
    this._toggleBottle1.bind(this);
    this._toggleBottle2.bind(this);
    this._toggleBarrel.bind(this);
  }

  _onInitialized(state, reason) {
    if (state == ViroConstants.TRACKING_NORMAL) {
      this.setState({
        text: "Hello World!",
      });
    } else if (state == ViroConstants.TRACKING_NONE) {
      // Handle loss of tracking
    }
  }

  _toggleBottle1() {
    this.setState({ show_bottle_1: false });
  }

  _toggleBottle2() {
    this.setState({ show_bottle_2: false });
  }

  _toggleBarrel() {
    this.setState({ barrel: true });
  }

  _planeSelected(anchor) {
    let modelArray = this.state.modelArray;
    modelArray = [...modelArray, this.getWine(anchor)];
    // Track the number of 3D assets that are on the screen.
    // Can be used to make limits or add further logic.
    this.setState({
      modelsCounter: this.state.modelsCounter + 1,
      pauseUpdates: true,
      modelArray,
      barrel: true,
    });
  }

  getWine(anchor) {
    return (
      <ViroARPlane anchorId={anchor.anchorId}>
        <ViroNode
          key="wine"
          dragType="FixedToPlane"
          dragPlane={{
            planePoint: [-1, 0, 0],
            planeNormal: [1, 0, 0],
            maxDistance: 2,
          }}
          visible={this.state.show_bottle_2}
          onClick={(e) => {
            this._toggleBottle2();
          }}
        >
          <Viro3DObject
            scale={[0.06, 0.06, 0.06]}
            source={require("./res/Wooden_Barrel.obj")}
            resources={[
              require("./res/Wooden_Barrel.mtl"),
              // require('./res/Wood_Diffuse.jpg')
            ]}
            type="OBJ"
            onLoadEnd={() => {
              this.arSelectorRef.reset();
            }}
          />

          <Viro3DObject
            position={[0, 0.75, 0]} // in meter
            scale={[0.02, 0.02, 0.02]}
            source={require("./res/wine2.obj")}
            resources={[require("./res/wine2.mtl")]}
            type="OBJ"
            onLoadEnd={() => {
              this.arSelectorRef.reset();
            }}
            onClick={(e) => {
              this._toggleBottle1();
            }}
            visible={this.state.show_bottle_1}
          />

          <Viro3DObject
            position={[0.06, 0.75, 0]}
            scale={[0.02, 0.02, 0.02]}
            source={require("./res/wine_romanee.obj")}
            resources={[require("./res/wine_romanee.mtl")]}
            type="OBJ"
            onLoadEnd={() => {
              this.arSelectorRef.reset();
            }}
            visible={this.state.show_bottle_2}
            onClick={(e) => {
              this._toggleBottle2();
            }}
          />

          <ViroQuad
            position={[0, 0, 0]}
            rotation={[-90, 0, 0]}
            height={10}
            width={10}
            arShadowReceiver={true}
          />
        </ViroNode>
      </ViroARPlane>
    );
  }

  render() {
    return (
      // The ViroARScene component wraps everything that will be rendered on screen
      <ViroARScene onTrackingUpdated={this._onInitialized}>
        <ViroAmbientLight color="#ffffff" intensity={200} />
        <ViroDirectionalLight
          color="#777777"
          direction={[0, -1, 0]}
          shadowOrthographicPosition={[0, 8, -5]}
          shadowOrthographicSize={10}
          shadowNearZ={2}
          shadowFarZ={9}
          lightInfluenceBitMask={2}
          castsShadow={true}
        />
        <ViroSpotLight
          innerAngle={5}
          outerAngle={25}
          direction={[0, -1, -0.2]}
          position={[2, 3, 0]}
          color="#ffffff"
          castsShadow={true}
          shadowMapSize={2048}
          shadowNearZ={5}
          shadowFarZ={5}
          shadowOpacity={0.7}
        />

        {/* 
        The following react component manages the messages of ARCore/ARKit of
        detected planes. Some parameter can be set in order to limit the size of
        planes (minHeight, minWidth, maxWidth) and the number of planes (maxPlanes).
        However, these are only ranges. The exact plane size is estimated from the 
        mapping information of ARCore/ARKit. 
        
        When a plane is selected, the information in forwarded using the function passed
        to onPlaneSelected. In this case, the passed function renders a plane that has different children.
        Please take a closer look at the getWine() function to inspect, which 3D assets will be rendered
        to the screen in this case.
        */}
        <ViroARPlaneSelector
          maxPlanes={3}
          minHeight={0.1}
          minWidth={0.1}
          maxWidth={0.3}
          visible={!this.state.barrel}
          ref={(selectorRef) => (this.arSelectorRef = selectorRef)}
          onPlaneSelected={this._planeSelected.bind(this)}
        ></ViroARPlaneSelector>

        {/*         
        The component ViroARImageMarker is used to enable detection of markers.
        It takes two properties: 
        The target property defines the image that should
        be detected in our scene. The target objects are created w/
        ViroARTrackingTargets.createTargets(...) in the bottom of this script.
        The onAnchorFound property takes an function as input that performs the logic
        that should happen, when the marker is detected successfully.
         */}
        <ViroARImageMarker
          target={"lafite_label"}
          onAnchorFound={this._onAnchorFound}
        >
          <ViroNode
            key="wine"
            dragType="FixedToPlane"
            dragPlane={{
              planePoint: [-1, 0, 0],
              planeNormal: [1, 0, 0],
              maxDistance: 2,
            }}
          >
            <Viro3DObject
              scale={[0.02, 0.02, 0.02]}
              source={require("./res/wine2.obj")}
              resources={[require("./res/wine2.mtl")]}
              type="OBJ"
              onLoadEnd={() => {
                this.arSelectorRef.reset();
              }}
            />

            <ViroQuad
              position={[0, 0, 0]}
              rotation={[-90, 0, 0]}
              height={10}
              width={10}
              arShadowReceiver={true}
            />
          </ViroNode>
        </ViroARImageMarker>

        <ViroARImageMarker
          target={"romanee_label"}
          onAnchorFound={this._onAnchorFound}
        >
          <ViroNode key="wine" dragType="FixedToWorld">
            <Viro3DObject
              scale={[0.02, 0.02, 0.02]}
              source={require("./res/wine_romanee.obj")}
              resources={[require("./res/wine_romanee.mtl")]}
              type="OBJ"
              onLoadEnd={() => {
                this.arSelectorRef.reset();
              }}
            />

            <ViroQuad
              position={[0, 0, 0]}
              rotation={[-90, 0, 0]}
              height={10}
              width={10}
              arShadowReceiver={true}
            />
          </ViroNode>
        </ViroARImageMarker>
        {/* Model array tracks all the different Viro3DObjects
        that should be rendered in the whole scene */}
        {this.state.modelArray}
      </ViroARScene>
    );
  }
}

ViroMaterials.createMaterials({
  ground: {
    cullMode: "None",
    shininess: 2.0,
    diffuseColor: "#ff9999",
    lightingModel: "Blinn",
  },
});

// Define targets for image marker detection.
// Also add a scale that will help the engine
// to have an idea of the scale of object to look for
ViroARTrackingTargets.createTargets({
  lafite_label: {
    source: require("./res/lafite_label.jpg"),
    orientation: "Up",
    physicalWidth: 0.165, // real world width in meters
  },
  romanee_label: {
    source: require("./res/romanee_label.jpg"),
    orientation: "Up",
    physicalWidth: 0.165, // real world width in meters
  },
});
var styles = StyleSheet.create({
  WineInfoStyle: {
    fontFamily: "Arial",
    fontSize: 5,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center",
  },
});

module.exports = ARWine;
