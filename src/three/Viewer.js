import * as THREE from 'three';
import { GeometryTypes } from '../models/GeometryTypes.js';

export class Viewer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        this.camera.position.z = 5;

        this.figures = [];
        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }

    updateScene(figures) {
        this.clearScene();
        figures.forEach((figure) => this.addFigureToScene(figure));
    }

    clearScene() {
        while(this.scene.children.length > 0) { 
            this.scene.remove(this.scene.children[0]); 
        }
    }

    addFigureToScene(figure) {
        let geometry;

        switch (figure.geometryType) {
            case GeometryTypes.BOX:
                geometry = new THREE.BoxGeometry(figure.size, figure.size, figure.size);
                break;
            case GeometryTypes.SPHERE:
                geometry = new THREE.SphereGeometry(figure.size / 2, 32, 32);
                break;
            case GeometryTypes.CYLINDER:
                geometry = new THREE.CylinderGeometry(figure.size / 2, figure.size / 2, figure.size, 32);
                break;
            default:
                return;
        }

        const material = new THREE.MeshBasicMaterial({ color: figure.color });
        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
    }
}
