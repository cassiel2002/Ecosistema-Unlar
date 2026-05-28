import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RotateCcw,
  Compass,
  ChevronRight,
  X,
  Target,
  Layers,
  Map,
} from 'lucide-react';

// ============================================
// Hotspot Data Interface & Definitions
// ============================================
export interface HotspotPin {
  id: string;
  label: string; // "1", "A", "E", "P" etc.
  type: 'numeric' | 'letter' | 'entrance' | 'parking' | 'sports' | 'transit';
  name: string;
  description: string;
  details: string[];
  x: number;
  y: number;
  z: number;
}

const CAMPUS_PINS: HotspotPin[] = [
  {
    id: 'pin-1',
    label: '1',
    type: 'numeric',
    name: 'Área Administrativa 1',
    description: 'Bloque administrativo principal de la UNLaR.',
    details: [
      'Rectorado',
      'Mesa de entrada',
      'Secretaría Académica',
      'Secretaría Nodocente',
      'SECyT',
      'FUNLaR',
      'Secretaría Legal y Técnica',
      'Secretaría de planificación',
    ],
    x: 5.5,
    y: 2.2,
    z: -7.5,
  },
  {
    id: 'pin-2',
    label: '2',
    type: 'numeric',
    name: 'Área Administrativa 2',
    description: 'Segundo bloque de dependencias administrativas centrales.',
    details: [
      'Secretaría General',
      'Secretaría Financiera',
    ],
    x: 6.3,
    y: 2.2,
    z: -4.0,
  },
  {
    id: 'pin-3',
    label: '3',
    type: 'numeric',
    name: 'Área Administrativa 3',
    description: 'Tercer bloque administrativo y de servicios de gestión.',
    details: [
      'Secretaría General',
      'Secretaría Financiera',
    ],
    x: 7.1,
    y: 2.2,
    z: -0.5,
  },
  {
    id: 'pin-4',
    label: '4',
    type: 'numeric',
    name: 'Dpto. de Sociales / Dpto. de Salud',
    description: 'Espacio integrado para aulas e institutos de Ciencias Sociales y de la Salud.',
    details: [
      'Decanato del Departamento de Ciencias Sociales',
      'Decanato del Departamento de Ciencias de la Salud',
      'Aulas de cursado comunes e institutos de investigación',
    ],
    x: 7.9,
    y: 2.2,
    z: 3.0,
  },
  {
    id: 'pin-5',
    label: '5',
    type: 'numeric',
    name: 'Dpto. de Exactas / Dpto. de Aplicadas',
    description: 'Bloque académico dedicado a ingenierías, informática y tecnologías aplicadas.',
    details: [
      'Decanato del Departamento de Ciencias Exactas y Tecnológicas',
      'Decanato del Departamento de Ciencias y Tecnologías Aplicadas',
      'Laboratorios técnicos y aulas de ingeniería',
    ],
    x: 8.7,
    y: 2.2,
    z: 6.5,
  },
  {
    id: 'pin-6',
    label: '6',
    type: 'numeric',
    name: 'Departamento de Humanidades',
    description: 'Sede y aulas del Departamento de Ciencias Humanas y de la Educación.',
    details: [
      'Decanato de Ciencias Humanas',
      'Bedelías de carreras de educación, artes y humanidades',
    ],
    x: 9.5,
    y: 2.2,
    z: 10.0,
  },
  {
    id: 'pin-7',
    label: '7',
    type: 'numeric',
    name: 'Museo de Ciencias Naturales',
    description: 'Espacio de exposición y preservación de colecciones paleontológicas y arqueológicas.',
    details: [
      'Colecciones paleontológicas y arqueológicas de la provincia',
      'Exposiciones abiertas al público general',
      'Visitas guiadas académicas',
    ],
    x: -8.5,
    y: 1.8,
    z: -9.2,
  },
  {
    id: 'pin-8',
    label: '8',
    type: 'numeric',
    name: 'Microcine',
    description: 'Sala audiovisual para proyecciones, debates y conferencias académicas.',
    details: [
      'Sala de proyecciones y conferencias',
      'Eventos culturales estudiantiles',
      'Espacio de debate y asambleas',
    ],
    x: -3.8,
    y: 1.8,
    z: -11.5,
  },
  {
    id: 'pin-9',
    label: '9',
    type: 'numeric',
    name: 'Biblioteca',
    description: 'Biblioteca central y salas de lectura del campus.',
    details: [
      'Biblioteca Central de la UNLaR',
      'Salas de lectura silenciosa y parlante',
      'Colección general de libros y tesis',
      'Servicio de fotocopiadora',
    ],
    x: -4.8,
    y: 1.8,
    z: -6.5,
  },
  {
    id: 'pin-10',
    label: '10',
    type: 'numeric',
    name: 'Oficina de Alumnos - SIU',
    description: 'Centro de trámites y soporte del sistema SIU Guaraní.',
    details: [
      'Trámites de inscripciones y reinscripciones anuales',
      'Atención y soporte técnico del SIU Guaraní',
      'Presentación de documentación y certificados académicos',
    ],
    x: -9.5,
    y: 1.8,
    z: -4.5,
  },
  {
    id: 'pin-11',
    label: '11',
    type: 'numeric',
    name: 'Comedor Universitario',
    description: 'Comedor estudiantil central y buffet general de la universidad.',
    details: [
      'Menú estudiantil subsidiado diario',
      'Área de mesas, recreación y esparcimiento',
      'Punto de encuentro de la comunidad universitaria',
    ],
    x: 10.5,
    y: 2.2,
    z: 11.2,
  },
  {
    id: 'pin-12',
    label: '12',
    type: 'numeric',
    name: 'CUERDA',
    description: 'Centro Universitario de Experimentación, Realización y Divulgación Audiovisual.',
    details: [
      'Estudios de grabación y posproducción de sonido y video',
      'Producción de contenidos multimedia institucionales',
    ],
    x: 6.8,
    y: 2.1,
    z: 13.0,
  },
  {
    id: 'pin-13',
    label: '13',
    type: 'numeric',
    name: 'Colegio Pre Universitario Gral. San Martín',
    description: 'Instalaciones de la escuela preuniversitaria de nivel secundario.',
    details: [
      'Aulas del nivel secundario preuniversitario',
      'Patios recreativos e instalaciones deportivas',
      'Preceptoría y administración del colegio',
    ],
    x: 11.5,
    y: 2.0,
    z: 15.5,
  },
  {
    id: 'pin-14',
    label: '14',
    type: 'numeric',
    name: 'Multimedios UNLaR',
    description: 'Sede del sistema de medios de comunicación oficial de la universidad.',
    details: [
      'Estudios de Radio UNLaR',
      'Canal de Televisión Universitario',
      'Redacción de prensa institucional y digital',
    ],
    x: 14.5,
    y: 2.0,
    z: 17.5,
  },
  {
    id: 'pin-15',
    label: '15',
    type: 'numeric',
    name: 'Gimnasio',
    description: 'Gimnasio techado e instalaciones deportivas cubiertas.',
    details: [
      'Playón deportivo cubierto multiuso',
      'Entrenamiento de equipos representativos de la UNLaR',
      'Actividades recreativas para estudiantes',
    ],
    x: 11.0,
    y: 2.0,
    z: 18.2,
  },
  {
    id: 'pin-16',
    label: '16',
    type: 'numeric',
    name: 'Residencia Docente',
    description: 'Alojamiento equipado para profesores e investigadores visitantes.',
    details: [
      'Habitaciones equipadas y áreas comunes de convivencia',
      'Alojamiento para docentes e investigadores de posgrado',
    ],
    x: -18.2,
    y: 2.4,
    z: -3.5,
  },
  {
    id: 'pin-a',
    label: 'A',
    type: 'letter',
    name: 'Módulo Áulico "A"',
    description: 'Pabellón central de aulas comunes para cursado general.',
    details: [
      'Aulas del 1 al 15',
      'Bedelía central del Pabellón A',
      'Espacio de estudio en pasillos',
    ],
    x: -6.2,
    y: 2.1,
    z: -1.2,
  },
  {
    id: 'pin-b',
    label: 'B',
    type: 'letter',
    name: 'Módulo Áulico "B"',
    description: 'Segundo bloque general de pabellones de aulas.',
    details: [
      'Aulas de clases comunes',
      'Bedelía central del Pabellón B',
    ],
    x: -2.1,
    y: 2.1,
    z: 2.2,
  },
  {
    id: 'pin-c',
    label: 'C',
    type: 'letter',
    name: 'Módulo Áulico "C"',
    description: 'Tercer bloque integrado de aulas universitarias.',
    details: [
      'Aulas de clases comunes',
      'Bedelía central del Pabellón C',
    ],
    x: 2.4,
    y: 2.1,
    z: 5.8,
  },
  {
    id: 'pin-d',
    label: 'D',
    type: 'letter',
    name: 'Módulo Áulico "D"',
    description: 'Cuarto bloque terminal de la grilla de pabellones.',
    details: [
      'Aulas comunes y laboratorios prácticos',
      'Bedelía central del Pabellón D',
    ],
    x: 6.8,
    y: 2.1,
    z: 9.4,
  },
  {
    id: 'pin-e',
    label: 'E',
    type: 'letter',
    name: 'Módulo Áulico - CIIPRA',
    description: 'Centro de Investigación e Innovación Tecnológica.',
    details: [
      'Investigaciones científicas aplicadas',
      'Laboratorios especiales y salas de investigación de CIIPRA',
    ],
    x: -12.0,
    y: 1.8,
    z: 14.5,
  },
  {
    id: 'pin-sports',
    label: '⚽',
    type: 'sports',
    name: 'Canchas y Playón Deportivo',
    description: 'Área deportiva al aire libre para actividades físicas y torneos.',
    details: [
      'Cancha de fútbol 11 de césped natural',
      'Pistas de atletismo y atletismo de campo',
      'Canchas de tenis y playón de básquet/vóley',
    ],
    x: -12.5,
    y: 0.8,
    z: 18.2,
  },
  {
    id: 'pin-parking',
    label: 'P',
    type: 'parking',
    name: 'Estacionamiento Principal',
    description: 'Playa de estacionamiento libre para la comunidad universitaria.',
    details: [
      'Capacidad para automóviles y motocicletas',
      'Ingreso directo de seguridad',
      'Iluminación LED de estacionamiento',
    ],
    x: 11.5,
    y: 0.5,
    z: -12.4,
  },
  {
    id: 'pin-e1',
    label: '🚪',
    type: 'entrance',
    name: 'Acceso Av. Luis M. de la Fuente',
    description: 'Entrada principal peatonal y vehicular sur.',
    details: [
      'Garita de seguridad central y control de ingreso',
      'Paradas de taxis y colectivos de línea urbana',
      'Bulevar central de ingreso peatonal con palmeras',
    ],
    x: 1.5,
    y: 0.5,
    z: -17.8,
  },
  {
    id: 'pin-e2',
    label: '🚪',
    type: 'entrance',
    name: 'Acceso Carlos Gardel',
    description: 'Entrada secundaria norte.',
    details: [
      'Ingreso directo peatonal desde barrio norte',
      'Acceso directo a las áreas de deporte y colegio preuniversitario',
    ],
    x: -16.8,
    y: 0.5,
    z: 14.2,
  },
];

// Helper to determine background colors based on Pin Type for HTML
const getPinColor = (type: HotspotPin['type']) => {
  switch (type) {
    case 'numeric':
      return 'bg-amber-500 border-amber-400 text-white';
    case 'letter':
      return 'bg-primary-600 border-primary-500 text-white';
    case 'entrance':
      return 'bg-sky-500 border-sky-400 text-white';
    case 'parking':
      return 'bg-gray-600 border-gray-500 text-white';
    case 'sports':
      return 'bg-emerald-600 border-emerald-500 text-white';
    default:
      return 'bg-primary-600 border-primary-500 text-white';
  }
};

// Helper to get hex colors for Three.js WebGL sprites
const getPinHexColor = (type: HotspotPin['type']) => {
  switch (type) {
    case 'numeric':
      return '#f59e0b'; // Amber-500
    case 'letter':
      return '#2563eb'; // Blue-600 (Primary)
    case 'entrance':
      return '#0ea5e9'; // Sky-500
    case 'parking':
      return '#4b5563'; // Gray-600
    case 'sports':
      return '#059669'; // Emerald-600
    default:
      return '#2563eb';
  }
};

// Helper to generate a round CanvasTexture with building label inside
function createPinTexture(label: string, colorHex: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.clearRect(0, 0, 64, 64);

  // Outer glowing ring
  ctx.beginPath();
  ctx.arc(32, 32, 29, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.fill();

  // Circle background matching category color
  ctx.beginPath();
  ctx.arc(32, 32, 23, 0, Math.PI * 2);
  ctx.fillStyle = colorHex;
  ctx.fill();
  
  // White border
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();

  // Draw text label
  ctx.font = 'bold 22px monospace';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, 32, 32);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export function CampusMap3D({ compact = false }: { compact?: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const [mapMode, setMapMode] = useState<'3d' | '2d'>('3d');
  const [zoom2D, setZoom2D] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [selectedPin, setSelectedPin] = useState<HotspotPin | null>(null);
  const [calibrationMode, setCalibrationMode] = useState(false);
  const [lastClickedCoords, setLastClickedCoords] = useState<THREE.Vector3 | null>(null);

  // Keep state refs in sync for WebGL loop closure access
  const mapModeRef = useRef<'3d' | '2d'>('3d');
  const selectedPinRef = useRef<HotspotPin | null>(null);

  useEffect(() => {
    mapModeRef.current = mapMode;
  }, [mapMode]);

  useEffect(() => {
    selectedPinRef.current = selectedPin;
  }, [selectedPin]);

  // Three.js instances refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const raycasterRef = useRef<THREE.Raycaster | null>(null);
  const mouseRef = useRef<THREE.Vector2 | null>(null);
  const campusModelRef = useRef<THREE.Object3D | null>(null);

  // Camera lerp target variables
  const lerpTargetPos = useRef<THREE.Vector3 | null>(null);
  const lerpTargetLookAt = useRef<THREE.Vector3 | null>(null);

  // Default camera configuration
  const defaultCameraPos = new THREE.Vector3(25, 20, 25);
  const defaultCameraTarget = new THREE.Vector3(0, 0, 0);

  // Reset Camera View
  const handleResetCamera = () => {
    setSelectedPin(null);
    lerpTargetPos.current = defaultCameraPos.clone();
    lerpTargetLookAt.current = defaultCameraTarget.clone();
    if (controlsRef.current) {
      controlsRef.current.target.copy(defaultCameraTarget);
    }
  };

  // Zoom into a specific pin
  const handleFocusPin = (pin: HotspotPin) => {
    setSelectedPin(pin);

    // Calculate a good offset camera position relative to the pin
    // We zoom in slightly from a slanted angle
    const targetPos = new THREE.Vector3(pin.x + 8, pin.y + 6, pin.z + 8);
    const targetLookAt = new THREE.Vector3(pin.x, pin.y, pin.z);

    lerpTargetPos.current = targetPos;
    lerpTargetLookAt.current = targetLookAt;
  };

  // Three.js Scene Setup & Loop
  useEffect(() => {
    if (!mountRef.current || !containerRef.current) return;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d); // Sleek dark slate
    sceneRef.current = scene;

    // Fog for depth
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.015);

    // 2. Camera
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.copy(defaultCameraPos);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Don't go below ground
    controls.minDistance = 3;
    controls.maxDistance = 80;
    controls.target.copy(defaultCameraTarget);
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.4);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(20, 40, 20);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 25;
    dirLight.shadow.camera.bottom = -25;
    dirLight.shadow.camera.left = -25;
    dirLight.shadow.camera.right = 25;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 150;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    // Subtle helper grid
    const gridHelper = new THREE.GridHelper(80, 80, 0x1f2937, 0x111827);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // 6. Raycasting Setup
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    raycasterRef.current = raycaster;
    mouseRef.current = mouse;

    // 6b. Static WebGL Pins Group
    const pinSprites: THREE.Sprite[] = [];
    const pinGroup = new THREE.Group();
    scene.add(pinGroup);

    CAMPUS_PINS.forEach((pin) => {
      const colorHex = getPinHexColor(pin.type);
      const texture = createPinTexture(pin.label, colorHex);
      if (!texture) return;

      const material = new THREE.SpriteMaterial({
        map: texture,
        depthTest: false, // Pins are always drawn on top of buildings
        sizeAttenuation: true,
      });

      const sprite = new THREE.Sprite(material);
      // Position slightly above building heights
      const pinHeight = pin.type === 'entrance' || pin.type === 'parking' || pin.type === 'sports' ? 1.0 : 2.5;
      sprite.position.set(pin.x, pin.y + pinHeight, pin.z);
      sprite.scale.set(2.2, 2.2, 1.0);
      sprite.userData = { pin };

      pinGroup.add(sprite);
      pinSprites.push(sprite);
    });

    // Raycast interaction event listeners on the canvas
    const handleCanvasClick = (e: MouseEvent) => {
      if (mapModeRef.current === '2d') return;
      if (!cameraRef.current || !rendererRef.current) return;

      const rect = rendererRef.current.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      mouse.set(x, y);
      raycaster.setFromCamera(mouse, cameraRef.current);

      const intersects = raycaster.intersectObjects(pinSprites);
      if (intersects.length > 0) {
        const clickedSprite = intersects[0].object as THREE.Sprite;
        const pin = clickedSprite.userData.pin as HotspotPin;
        handleFocusPin(pin);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (mapModeRef.current === '2d') return;
      if (!cameraRef.current || !rendererRef.current) return;

      const rect = rendererRef.current.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      mouse.set(x, y);
      raycaster.setFromCamera(mouse, cameraRef.current);

      const intersects = raycaster.intersectObjects(pinSprites);
      if (intersects.length > 0) {
        rendererRef.current.domElement.style.cursor = 'pointer';
      } else {
        rendererRef.current.domElement.style.cursor = 'grab';
      }
    };

    renderer.domElement.addEventListener('click', handleCanvasClick);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);

    // 7. GLB Model Loading
    const loader = new GLTFLoader();
    loader.load(
      '/Universidad.glb',
      (gltf: any) => {
        const model = gltf.scene;

        // Traverse and adjust materials and shadows
        model.traverse((child: any) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            if (mesh.material) {
              const prevMat = mesh.material as THREE.MeshStandardMaterial;
              const name = mesh.name.toLowerCase();
              const matName = prevMat.name ? prevMat.name.toLowerCase() : '';

              // Default standard parameters
              let baseColor = prevMat.color ? prevMat.color.getHex() : 0xcccccc;
              let roughness = 0.75;
              let metalness = 0.1;
              let opacity = 1.0;
              let transparent = false;

              // Check if mesh has baked texture mapping
              const hasMap = !!prevMat.map;

              // Semantic material classification to apply realistic university colors & textures
              if (
                name.includes('grass') || name.includes('cesped') || name.includes('jardin') || 
                name.includes('garden') || name.includes('verde') || name.includes('lawn') ||
                matName.includes('grass') || matName.includes('cesped') || matName.includes('garden')
              ) {
                // Lush green campus fields
                if (!hasMap) baseColor = 0x2e7d32; 
                roughness = 0.95;
                metalness = 0.0;
              } else if (
                name.includes('roof') || name.includes('techo') || name.includes('teja') || 
                name.includes('cubierta') || name.includes('pabellon_roof') ||
                matName.includes('roof') || matName.includes('techo') || matName.includes('teja')
              ) {
                // Classic brick-red terracotta university roofs
                if (!hasMap) baseColor = 0xb06a5b; 
                roughness = 0.8;
                metalness = 0.05;
              } else if (
                name.includes('wall') || name.includes('pared') || name.includes('muro') || 
                name.includes('pabellon') || name.includes('edificio') || name.includes('column') ||
                matName.includes('wall') || matName.includes('pared') || matName.includes('muro')
              ) {
                // Concrete eggshell walls
                if (!hasMap) baseColor = 0xeaeaea; 
                roughness = 0.85;
                metalness = 0.02;
              } else if (
                name.includes('window') || name.includes('glass') || name.includes('vidrio') || 
                name.includes('cristal') || name.includes('ventana') ||
                matName.includes('window') || matName.includes('glass') || matName.includes('vidrio')
              ) {
                // Semi-translucent glass windows
                baseColor = 0xa5d6a7; 
                roughness = 0.05;
                metalness = 0.95;
                opacity = 0.65;
                transparent = true;
              } else if (
                name.includes('road') || name.includes('calle') || name.includes('asfalto') || 
                name.includes('street') || name.includes('highway') || name.includes('parking') ||
                matName.includes('road') || matName.includes('calle') || matName.includes('asfalto')
              ) {
                // Clean charcoal asphalt gray roads
                if (!hasMap) baseColor = 0x37474f; 
                roughness = 0.9;
                metalness = 0.1;
              } else if (
                name.includes('sport') || name.includes('cancha') || name.includes('track') || 
                name.includes('pista') || name.includes('court') || name.includes('run') ||
                matName.includes('sport') || matName.includes('cancha')
              ) {
                // Athletic clay track/tennis courts red
                if (!hasMap) baseColor = 0xd84315; 
                roughness = 0.85;
                metalness = 0.05;
              } else if (
                name.includes('tree') || name.includes('foliage') || name.includes('hojas') || 
                name.includes('planta') || name.includes('arbusto') ||
                matName.includes('tree') || matName.includes('foliage')
              ) {
                // Deep organic tree greens
                if (!hasMap) baseColor = 0x1b5e20; 
                roughness = 0.95;
                metalness = 0.0;
              } else if (
                name.includes('trunk') || name.includes('tronco') || name.includes('wood') || 
                name.includes('madera') || matName.includes('wood') || matName.includes('madera')
              ) {
                // Timber wood brown trunks
                if (!hasMap) baseColor = 0x5d4037; 
                roughness = 0.9;
                metalness = 0.0;
              }

              // Apply custom physical rendering properties
              mesh.material = new THREE.MeshStandardMaterial({
                color: new THREE.Color(baseColor),
                map: prevMat.map,
                roughness: roughness,
                metalness: metalness,
                opacity: opacity,
                transparent: transparent,
                bumpMap: prevMat.bumpMap,
                bumpScale: prevMat.bumpScale || 0.05,
              });
            }
          }
        });

        // Center model and add to scene
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Align model center to scene origin (0, 0, 0)
        model.position.x += -center.x;
        model.position.y += -center.y + 0.1; // Elevate slightly above grid
        model.position.z += -center.z;

        // Scale model to a standard dimension
        const maxDim = Math.max(size.x, size.z);
        const targetScale = 45 / maxDim;
        model.scale.set(targetScale, targetScale, targetScale);

        scene.add(model);
        campusModelRef.current = model;
        setLoading(false);
      },
      (xhr: any) => {
        if (xhr.total > 0) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          setLoadProgress(percent);
        }
      },
      (error: any) => {
        console.error('Error loading GLB model:', error);
        setLoading(false);
      }
    );

    // 8. Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Handle camera positioning lerp transitions
      if (cameraRef.current && controlsRef.current) {
        const cam = cameraRef.current;
        const ctrl = controlsRef.current;

        // Smoothly interpolate position
        if (lerpTargetPos.current) {
          cam.position.lerp(lerpTargetPos.current, 0.06);
          // If close enough, complete lerp
          if (cam.position.distanceTo(lerpTargetPos.current) < 0.05) {
            lerpTargetPos.current = null;
          }
        }

        // Smoothly interpolate control target (look-at)
        if (lerpTargetLookAt.current) {
          ctrl.target.lerp(lerpTargetLookAt.current, 0.06);
          if (ctrl.target.distanceTo(lerpTargetLookAt.current) < 0.05) {
            lerpTargetLookAt.current = null;
          }
        }
      }

      // Pulse animation and scaling for static pin sprites
      pinSprites.forEach((sprite) => {
        const pin = sprite.userData.pin as HotspotPin;
        const isSelected = selectedPinRef.current?.id === pin.id;

        const time = Date.now() * 0.003;
        const scaleFactor = isSelected ? 2.8 + Math.sin(time) * 0.35 : 2.2;
        sprite.scale.set(scaleFactor, scaleFactor, 1.0);

        // Highlight selected pin material color
        const mat = sprite.material as THREE.SpriteMaterial;
        mat.color.setHex(isSelected ? 0xffffff : 0xdddddd);
      });

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // 9. Handle Resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;

      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.domElement.removeEventListener('click', handleCanvasClick);
        rendererRef.current.domElement.removeEventListener('mousemove', handleMouseMove);
      }

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }

      // Dispose of static pin textures and materials to prevent WebGL leaks
      pinSprites.forEach((sprite) => {
        sprite.material.map?.dispose();
        sprite.material.dispose();
      });

      // Dispose Three.js objects
      renderer.dispose();
    };
  }, []);

  // 11. Coordinate Calibration (Double-click mesh detector)
  const handleCanvasDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!calibrationMode || !cameraRef.current || !sceneRef.current || !raycasterRef.current || !mouseRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    mouseRef.current.set(x, y);
    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

    // Intersect scene meshes
    const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children, true);

    if (intersects.length > 0) {
      // Find the first point that is part of the loaded glb model
      const hit = intersects.find((h: any) => {
        let parent = h.object.parent;
        while (parent) {
          if (parent === campusModelRef.current) return true;
          parent = parent.parent;
        }
        return false;
      });

      if (hit) {
        const point = hit.point;
        setLastClickedCoords(point.clone());
        // Print coordinates to console for developers
        console.log(`Calibrated coordinates: x: ${point.x.toFixed(2)}, y: ${point.y.toFixed(2)}, z: ${point.z.toFixed(2)}`);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden border border-gray-800 bg-gray-955 shadow-2xl flex select-none ${
        compact 
          ? 'h-60 rounded-2xl flex-col' 
          : 'h-[65vh] md:h-[70vh] rounded-3xl flex-col md:flex-row'
      }`}
    >
      {/* 3D View Container */}
      <div
        ref={mountRef}
        onDoubleClick={handleCanvasDoubleClick}
        className="relative flex-1 h-full cursor-grab active:cursor-grabbing overflow-hidden"
      >
        {/* Map Mode Selector Tab HUD */}
        <div className="absolute top-4 right-4 z-30 flex bg-gray-900/90 backdrop-blur-md border border-gray-800 p-1 rounded-xl shadow-lg pointer-events-auto">
          <button
            onClick={() => setMapMode('3d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              mapMode === '3d'
                ? 'bg-primary-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Vista 3D</span>
          </button>
          <button
            onClick={() => setMapMode('2d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              mapMode === '2d'
                ? 'bg-primary-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
            }`}
          >
            <Map className="h-3.5 w-3.5" />
            <span>Mapa 2D</span>
          </button>
        </div>


        {/* 2D Map Picture Overlay */}
        <AnimatePresence>
          {mapMode === '2d' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-950 z-20 flex flex-col items-center justify-center p-6 overflow-hidden select-none"
            >
              {/* Blurred glowing background for premium vibe */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-5 blur-xl pointer-events-none"
                style={{ backgroundImage: `url('https://i.ibb.co/HDL95dww/ubi-completa-unlar.png')` }}
              />

              {/* Zoom Controls HUD Overlay */}
              <div className="absolute top-4 left-4 z-30 flex items-center gap-1.5 bg-gray-900/90 backdrop-blur-md border border-gray-800 p-1.5 rounded-xl shadow-lg pointer-events-auto">
                <button
                  onClick={() => setZoom2D((z) => Math.max(z - 0.5, 1))}
                  disabled={zoom2D <= 1}
                  className="px-2.5 py-1 bg-gray-850 hover:bg-gray-700 disabled:opacity-40 text-xs font-bold text-white rounded-lg cursor-pointer"
                >
                  -
                </button>
                <span className="text-[10px] font-mono font-bold text-gray-300 min-w-[36px] text-center">
                  {Math.round(zoom2D * 100)}%
                </span>
                <button
                  onClick={() => setZoom2D((z) => Math.min(z + 0.5, 4))}
                  disabled={zoom2D >= 4}
                  className="px-2.5 py-1 bg-gray-850 hover:bg-gray-700 disabled:opacity-40 text-xs font-bold text-white rounded-lg cursor-pointer"
                >
                  +
                </button>
                <button
                  onClick={() => setZoom2D(1)}
                  className="ml-1 px-2 py-1 bg-gray-850 hover:bg-gray-700 text-[10px] font-semibold text-gray-300 rounded-lg cursor-pointer"
                >
                  Reajustar
                </button>
              </div>

              {/* Scrollable Zoom Image Container */}
              <div className="w-full h-[82%] rounded-2xl border border-gray-800 bg-gray-950 overflow-auto flex items-center justify-center p-4 cursor-zoom-in pointer-events-auto scrollbar-thin scrollbar-thumb-gray-850">
                <img
                  src="https://i.ibb.co/HDL95dww/ubi-completa-unlar.png"
                  alt="Plano Completo UNLaR"
                  style={{
                    width: `${100 * zoom2D}%`,
                    height: `${100 * zoom2D}%`,
                    transition: 'width 0.25s ease-out, height 0.25s ease-out',
                  }}
                  className="max-w-none max-h-none object-contain rounded-lg"
                />
              </div>

              <div className="mt-4 text-center z-10">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest">Plano General del Campus</h4>
                <p className="text-[10px] text-gray-500 mt-1 max-w-sm">
                  Desplazate sobre la imagen para navegar en alto zoom.
                </p>
              </div>
              <a
                href="https://i.ibb.co/HDL95dww/ubi-completa-unlar.png"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 z-30 flex items-center gap-1.5 px-3 py-2 bg-gray-900/85 backdrop-blur-md border border-gray-800 rounded-xl text-[10px] font-semibold text-gray-300 hover:text-white hover:bg-gray-800 transition-all shadow-lg pointer-events-auto"
              >
                <span>Ver original ↗</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3D View HUD Control Buttons */}
        {mapMode === '3d' && (
          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
            <button
              onClick={handleResetCamera}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-900/85 backdrop-blur-md border border-gray-800 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-gray-800 transition-all shadow-lg pointer-events-auto"
              title="Restablecer Vista"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reiniciar</span>
            </button>

            <button
              onClick={() => setCalibrationMode(!calibrationMode)}
              className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-semibold transition-all shadow-lg pointer-events-auto ${calibrationMode
                  ? 'bg-amber-600 border-amber-500 text-white'
                  : 'bg-gray-900/85 backdrop-blur-md border-gray-800 text-gray-400 hover:text-white'
                }`}
              title="Herramienta de Calibración de Coordenadas"
            >
              <Target className="h-3.5 w-3.5" />
              <span>{calibrationMode ? 'Modo Calibración ON' : 'Calibrar'}</span>
            </button>
          </div>
        )}

        {/* 3D Loading Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-950/95 backdrop-blur-md flex flex-col items-center justify-center z-50 p-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                className="mb-4 text-primary-400"
              >
                <Compass className="h-10 w-10 animate-pulse" />
              </motion.div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1.5">
                Cargando Campus 3D
              </h3>
              <p className="text-xs text-gray-500 mb-4 max-w-xs text-center leading-relaxed">
                Estamos procesando la maqueta tridimensional interactiva de la universidad...
              </p>

              {/* Load Progress bar */}
              <div className="w-48 h-1.5 bg-gray-900 border border-gray-800 rounded-full overflow-hidden mb-2">
                <motion.div
                  className="h-full bg-primary-500 rounded-full"
                  style={{ width: `${loadProgress}%` }}
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-primary-400">
                {loadProgress}%
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Calibration coordinates popup */}
        {calibrationMode && lastClickedCoords && mapMode === '3d' && (
          <div className="absolute top-4 left-4 z-20 p-3 bg-amber-950/90 border border-amber-800/80 rounded-xl backdrop-blur-md text-[10px] font-mono text-amber-200 shadow-xl max-w-xs pointer-events-auto leading-normal">
            <div className="flex items-center justify-between pb-1.5 border-b border-amber-800/50 mb-1.5">
              <span className="font-bold uppercase tracking-wider text-amber-400">Coordenadas 3D</span>
              <button
                onClick={() => setLastClickedCoords(null)}
                className="text-amber-400 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <p className="font-bold">x: {lastClickedCoords.x.toFixed(3)}</p>
            <p className="font-bold">y: {lastClickedCoords.y.toFixed(3)}</p>
            <p className="font-bold">z: {lastClickedCoords.z.toFixed(3)}</p>
            <p className="text-[8px] text-amber-400/70 mt-1">
              * Doble clic en el modelo 3D para registrar nuevas coordenadas. Copiá estos valores en el array CAMPUS_PINS.
            </p>
          </div>
        )}

        {/* Floating Street names in HUD */}
        {mapMode === '3d' && (
          <>
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-gray-950/60 backdrop-blur-sm border border-gray-800/40 rounded-full px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase text-gray-500 pointer-events-none select-none">
              🛣️ Av. Luis M. De La Fuente
            </div>
            <div className="absolute top-1/2 left-4 -translate-y-1/2 -rotate-90 origin-left bg-gray-950/60 backdrop-blur-sm border border-gray-800/40 rounded-full px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase text-gray-500 pointer-events-none select-none">
              🛣️ Calle Carlos Gardel
            </div>
            {/* Detail Overlay Card Panel */}
        <AnimatePresence>
          {selectedPin && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="absolute bottom-4 right-4 left-4 md:left-auto md:w-80 z-30 p-5 bg-gray-950/95 border border-gray-800 rounded-2xl backdrop-blur-xl shadow-2xl space-y-3 pointer-events-auto"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-6 w-6 rounded-full border flex items-center justify-center text-[10px] font-bold font-mono ${getPinColor(selectedPin.type)}`}>
                    {selectedPin.label}
                  </span>
                  <h3 className="font-bold text-white text-xs leading-tight">
                    {selectedPin.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedPin(null)}
                  className="p-1 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed">
                {selectedPin.description}
              </p>

              {selectedPin.details.length > 0 && (
                <div className="space-y-1.5 border-t border-gray-900 pt-3">
                  <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest block mb-1">
                    ¿Qué encontrás acá?
                  </span>
                  <ul className="space-y-1 text-[10px] text-gray-500 leading-normal">
                    {selectedPin.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-primary-500 mt-0.5">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Interactive Sidebar Panel */}
      {!compact && (
        <div className="w-full md:w-80 h-48 md:h-full border-t md:border-t-0 md:border-l border-gray-850 bg-gray-900/40 backdrop-blur-xl flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-800 flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Lugares de Referencia
            </span>
          </div>

          {/* Sidebar reference list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-hide">
            {CAMPUS_PINS.map((pin) => {
              const isSelected = selectedPin?.id === pin.id;
              return (
                <button
                  key={pin.id}
                  onClick={() => handleFocusPin(pin)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left border transition-all text-xs font-semibold ${isSelected
                      ? 'bg-primary-600/10 border-primary-500/40 text-primary-300'
                      : 'bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-gray-800/40'
                    }`}
                >
                  {/* Numeric/Letter symbol matching the pin */}
                  <span
                    className={`h-6 w-6 rounded-full border flex items-center justify-center text-[10px] font-bold font-mono ${getPinColor(
                      pin.type
                    )}`}
                  >
                    {pin.label}
                  </span>
                  <span className="truncate flex-1">{pin.name}</span>
                  <ChevronRight className={`h-4 w-4 text-gray-500 transition-transform ${isSelected ? 'translate-x-0.5 text-primary-400' : ''}`} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
