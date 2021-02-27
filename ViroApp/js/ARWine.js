'use strict';

import React, { Component } from 'react';

import {StyleSheet} from 'react-native';

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
  ViroText
} from 'react-viro';




class ARWine extends Component{

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

    // bind 'this' to functions
    this._onInitialized = this._onInitialized.bind(this);
    this._toggleBottle1.bind(this);
    this._toggleBottle2.bind(this);
    this._toggleBarrel.bind(this);
  }

  _onInitialized(state, reason) {
    if (state == ViroConstants.TRACKING_NORMAL) {
      this.setState({
        text : "Hello World!"
      });
    } else if (state == ViroConstants.TRACKING_NONE) {
      // Handle loss of tracking
    }
  }

  _toggleBottle1(){
    this.setState({show_bottle_1: false})
  }

  _toggleBottle2(){
    this.setState({show_bottle_2: false})
  }

  _toggleBarrel(){
    this.setState({barrel: true})
  }

  _planeSelected(anchor){
    let modelArray = this.state.modelArray;
        modelArray = [...modelArray, this.getWine(anchor)] 
    
    this.setState({
      modelsCounter: this.state.modelsCounter + 1,
      pauseUpdates: true,
      modelArray,
      barrel: true
    })
  }

getWine(anchor){
  return (
 <ViroARPlane anchorId={anchor.anchorId}>
       <ViroNode key="wine"
        dragType="FixedToPlane"
        dragPlane={{planePoint: [-1, 0, 0], planeNormal: [1, 0, 0], maxDistance: 2}}
        visible={this.state.show_bottle_2}
        onClick={(e)=>{this._toggleBottle2()}}

        >
          
                <Viro3DObject
                
                   scale={[.06, .06, .06]}
          source={require('./res/Wooden_Barrel.obj')}
          resources={[require('./res/Wooden_Barrel.mtl'),
          // require('./res/Wood_Diffuse.jpg')
                      ]}
                    
          type="OBJ"
          onLoadEnd={() => {
            this.arSelectorRef.reset()
            
          }}

       
           />

{/* <ViroText
 position={[0.03,1.0,0]}
 text={"Verkaufen"}
 color="#ffffff"
          width={2}
          height={2}
          onClick={(e)=>{this._toggleBottle1()}}
          rotation={[0, 45, 0]}
          style={styles.WineInfoStyle}
 />

<ViroText
 position={[0.07,1.0,0]}
 text={"Verkaufen"}
 color="#ffffff"
          width={2}
          height={2}
          onClick={(e)=>{this._toggleBottle2()}}
          rotation={[0, 45, 0]}
          style={styles.WineInfoStyle}
 /> */}


<Viro3DObject
                position={[0,.75,0]}
                scale={[.02, .02, .02]}
       source={require('./res/wine2.obj')}
       resources={[require('./res/wine2.mtl'),
                   ]}
                 
       type="OBJ"
       onLoadEnd={() => {
         this.arSelectorRef.reset()
       }}
       onClick={(e)=>{this._toggleBottle1()}}
       visible={this.state.show_bottle_1}

        />
     
     <Viro3DObject
      
                position={[0.06,.75,0]}
                scale={[.02, .02, .02]}
       source={require('./res/wine_romanee.obj')}
       resources={[require('./res/wine_romanee.mtl'),
                   ]}
                 
       type="OBJ"
       onLoadEnd={() => {
         this.arSelectorRef.reset()
       }}
       visible={this.state.show_bottle_2}
       onClick={(e)=>{this._toggleBottle2()}}
        />

     
        <ViroQuad
          position={[0,0,0]}
          rotation={[-90, 0, 0]}
          height={10} 
          width={10}
          arShadowReceiver={true}
         
        />
      </ViroNode>
    </ViroARPlane>
    
  )
}

  

  
    render() {
      return (
        <ViroARScene onTrackingUpdated={this._onInitialized}>
        <ViroAmbientLight color="#ffffff" intensity={200}/>
        <ViroDirectionalLight color="#777777"
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
          direction={[0, -1, -.2]}
          position={[2, 3, 0]}
          color="#ffffff"
          castsShadow={true}
          shadowMapSize={2048}
          shadowNearZ={5}
          shadowFarZ={5}
          shadowOpacity={.7}
        />
        {/* <ViroText 
          text="change particle effects" 
          color="#ffffff"
          width={2}
          height={2}
          position={[-2, 1, -2]}
          rotation={[0, 45, 0]}
          style={styles.helloWorldTextStyle}
          onClick={() => {
            this.setState({
              currentEffect: this.state.currentEffect + 1 > 2 ? 0 : this.state.currentEffect + 1
            })
          }}
        /> */}
        <ViroARPlaneSelector 
        
        maxPlanes={3}
        minHeight={.1}
        minWidth={.1}
        maxWidth={.3}
        visible={!this.state.barrel}
          ref={(selectorRef) => 
              this.arSelectorRef = selectorRef}
          onPlaneSelected={
            this._planeSelected.bind(this)
            } 
        >
        </ViroARPlaneSelector>

        <ViroARImageMarker target={"lafite_label"}
        onAnchorFound={this._onAnchorFound}
        //  pauseUpdates={this.state.pauseUpdates}
         >
           <ViroNode key="wine"
        dragType="FixedToPlane"
        dragPlane={{planePoint: [-1, 0, 0], planeNormal: [1, 0, 0], maxDistance: 2}}>
                <Viro3DObject
                
                   scale={[.02, .02, .02]}
          source={require('./res/wine2.obj')}
          resources={[require('./res/wine2.mtl'),
                      ]}
                    
          type="OBJ"
          onLoadEnd={() => {
            this.arSelectorRef.reset()
          }}
  
           />
     
        <ViroQuad
          position={[0,0,0]}
          rotation={[-90, 0, 0]}
          height={10} 
          width={10}
          arShadowReceiver={true}
         
        />
      </ViroNode>

         </ViroARImageMarker>


         <ViroARImageMarker target={"romanee_label"}
        onAnchorFound={this._onAnchorFound}
        //  pauseUpdates={this.state.pauseUpdates}
         >
           <ViroNode key="wine"
        dragType="FixedToWorld">
                <Viro3DObject
                
                   scale={[.02, .02, .02]}
                   source={require('./res/wine_romanee.obj')}
                   resources={[require('./res/wine_romanee.mtl'),
                      ]}
                    
          type="OBJ"
          onLoadEnd={() => {
            this.arSelectorRef.reset()
          }}
  
           />
     
        <ViroQuad
          position={[0,0,0]}
          rotation={[-90, 0, 0]}
          height={10} 
          width={10}
          arShadowReceiver={true}
         
        />
      </ViroNode>

         </ViroARImageMarker>


        { this.state.modelArray }
        {/* <ViroNode position={[0, 0, -3]}>
          { this.getEffect() } 
        </ViroNode> */}
      </ViroARScene>
    )
          }
        }
  




 


  // ,
  // _onAnchorFound() {
  //   this.setState({
  //     animateCar: true,
  //   })
  // },
  // _toggleButtons() {
  //   this.setState({
  //     animName: (this.state.animName == "scaleUp" ? "scaleDown" : "scaleUp"),
  //     playAnim: true
  //   })
  // },
  // _selectWhite(){
  //   this.setState({
  //     texture : "white",
  //     tapWhite: true
  //   })
  // },
  // _selectBlue(){
  //   this.setState({
  //     texture : "blue",
  //     tapBlue: true
  //   })
  // },
  // _selectGrey(){
  //   this.setState({
  //     texture : "grey",
  //     tapGrey: true
  //   })
  // },
  // _selectRed(){
  //   this.setState({
  //     texture : "red",
  //     tapRed: true
  //   })
  // },
  // _selectYellow(){
  //   this.setState({
  //     texture : "yellow",
  //     tapYellow: true
  //   })
  // },
  // _animateFinished(){
  //   this.setState({
  //     tapWhite: false,
  //     tapBlue: false,
  //     tapGrey: false,
  //     tapRed: false,
  //     tapYellow: false,
  //   })
  // },


// ViroMaterials.createMaterials({
//   white: {
//     lightingModel: "PBR",
//     diffuseTexture: require('./res/tesla/object_car_main_Base_Color.png'),
//     metalnessTexture: require('./res/tesla/object_car_main_Metallic.png'),
//     roughnessTexture: require('./res/tesla/object_car_main_Roughness.png'),
//   },
//   blue: {
//     lightingModel: "PBR",
//     diffuseTexture: require('./res/tesla/object_car_main_Base_Color_blue.png'),
//     metalnessTexture: require('./res/tesla/object_car_main_Metallic.png'),
//     roughnessTexture: require('./res/tesla/object_car_main_Roughness.png'),
//   },
//   grey: {
//     lightingModel: "PBR",
//     diffuseTexture: require('./res/tesla/object_car_main_Base_Color_grey.png'),
//     metalnessTexture: require('./res/tesla/object_car_main_Metallic.png'),
//     roughnessTexture: require('./res/tesla/object_car_main_Roughness.png'),
//   },
//   red: {
//     lightingModel: "PBR",
//     diffuseTexture: require('./res/tesla/object_car_main_Base_Color_red.png'),
//     metalnessTexture: require('./res/tesla/object_car_main_Metallic.png'),
//     roughnessTexture: require('./res/tesla/object_car_main_Roughness.png'),
//   },
//   yellow: {
//     lightingModel: "PBR",
//     diffuseTexture: require('./res/tesla/object_car_main_Base_Color_yellow.png'),
//     metalnessTexture: require('./res/tesla/object_car_main_Metallic.png'),
//     roughnessTexture: require('./res/tesla/object_car_main_Roughness.png'),
//   },
//   white_sphere: {
//     lightingModel: "PBR",
//     diffuseColor: "rgb(231,231,231)",
//   },
//   blue_sphere: {
//     lightingModel: "PBR",
//     diffuseColor: "rgb(19,42,143)",
//   },
//   grey_sphere: {
//     lightingModel: "PBR",
//     diffuseColor: "rgb(75,76,79)",
//   },
//   red_sphere: {
//     lightingModel: "PBR",
//     diffuseColor: "rgb(168,0,0)",
//   },
//   yellow_sphere: {
//     lightingModel: "PBR",
//     diffuseColor: "rgb(200,142,31)",
//   },
// });

// ViroARTrackingTargets.createTargets({
//   logo : {
//     source : require('./res/logo.png'),
//     orientation : "Up",
//     physicalWidth : 0.165 // real world width in meters
//   }
// });

// ViroAnimations.registerAnimations({
//     scaleUp:{properties:{scaleX:1, scaleY:1, scaleZ:1,},
//                   duration: 500, easing: "bounce"},
//     scaleDown:{properties:{scaleX:0, scaleY:0, scaleZ:0,},
//                   duration: 200,},
//     scaleCar:{properties:{scaleX:.09, scaleY:.09, scaleZ:.09,},
//                   duration: 500, easing: "bounce"},
//     scaleSphereUp:{properties:{scaleX:.8, scaleY:.8, scaleZ:.8,},
//                   duration: 50, easing: "easeineaseout"},
//     scaleSphereDown:{properties:{scaleX:1, scaleY:1, scaleZ:1,},
//                   duration: 50, easing: "easeineaseout"},
//     tapAnimation:[["scaleSphereUp", "scaleSphereDown"],]
// });

ViroMaterials.createMaterials({
  ground:{
    cullMode: "None",
    shininess: 2.0,
    diffuseColor: "#ff9999",
    lightingModel: "Blinn",
  }
 });

 ViroARTrackingTargets.createTargets({
  lafite_label : {
    source : require('./res/lafite_label.jpg'),
    orientation : "Up",
    physicalWidth : 0.165 // real world width in meters
  },
  romanee_label : {
    source : require('./res/romanee_label.jpg'),
    orientation : "Up",
    physicalWidth : 0.165 // real world width in meters
  }
});
var styles = StyleSheet.create({
  WineInfoStyle: {
    fontFamily: 'Arial',
    fontSize: 5,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',  
  }
});

module.exports = ARWine;