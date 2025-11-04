<template>
  <div ref="container" style="width: 100%; height: 500px;"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const container = ref(null)
let renderer, scene, camera, animationId, controls

onMounted(() => {
  // 场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)

  // 相机
  camera = new THREE.PerspectiveCamera(75, container.value.clientWidth / container.value.clientHeight, 0.1, 1000)
  camera.position.set(0, 1, 3)

  // 渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  container.value.appendChild(renderer.domElement)

  // 灯光
// 添加环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// 添加方向光
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// 添加点光源
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(0, 1, 0);
scene.add(pointLight);
// 添加底部补光
const bottomLight = new THREE.DirectionalLight(0xffffff, 0.5);
bottomLight.position.set(0, -1, 0); // 从底部向上照射
scene.add(bottomLight);

// 添加侧光
const sideLight = new THREE.DirectionalLight(0xffffff, 0.6);
sideLight.position.set(-1, 0.5, 0); // 从左侧照射
scene.add(sideLight);

  // FBX加载
  const loader = new FBXLoader()
  loader.load('/models/包1.fbx', (object) => {
    object.position.set(0, 0, 0)
    object.scale.set(0.01, 0.01, 0.01) // 或 1,1,1 视模型而定
    scene.add(object)

    // 初始化控制器
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.screenSpacePanning = false
    controls.minDistance = 1
    controls.maxDistance = 100
  })

  // 动画循环
  function animate() {
    animationId = requestAnimationFrame(animate)
    if (controls) controls.update() // 更新控制器
    renderer.render(scene, camera)
  }
  animate()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  renderer.dispose()
})
</script>
