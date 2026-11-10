/**
 * Moonshine Flow Manager - Industrial Scheduling & Order Engine
 * Diseñado para operaciones 24/7 de manufactura esbelta (Lean / Moonshine)
 * Compatible con SharePoint, PowerApps, Outlook y SketchUp
 */

// ==========================================
// 1. CONFIGURACIÓN Y ESTADO INICIAL
// ==========================================
const STORAGE_KEYS = {
  ORDERS: 'msh_orders_v1',
  CATALOG: 'msh_catalog_v3',
  ROSTER: 'msh_roster_v2',
  TECHNICIANS: 'msh_technicians_v2',
  ROSTER_SCHEDULE: 'msh_roster_schedule_v2',
  SETTINGS: 'msh_settings_v1',
  PLAN: 'msh_schedule_plan_v1',
  OVERTIME: 'msh_overtime_v1',
  ACTIVE_TECH: 'msh_active_tech_v1'
};

// Días de la semana
const DAYS_OF_WEEK = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

// Turnos de trabajo 24/7
const SHIFTS_DEF = [
  { id: 1, name: 'Turno 1', label: 'T1 - Matutino', hours: '7:00 AM - 3:00 PM', effectiveHours: 7.5, color: 'blue' },
  { id: 2, name: 'Turno 2', label: 'T2 - Vespertino', hours: '3:00 PM - 11:00 PM', effectiveHours: 7.5, color: 'amber' },
  { id: 3, name: 'Turno 3', label: 'T3 - Nocturno', hours: '11:00 PM - 7:00 AM', effectiveHours: 7.5, color: 'purple' }
];

// Catálogo inicial con modelos SketchUp y tiempos estándar en horas
const DEFAULT_CATALOG = [
  {
    id: 'EST-001',
    name: 'TRAY CAR',
    category: 'Carros & Material Handling',
    standardHours: 4.5,
    unitPrice: 800,
    sketchupCode: 'SKP-_zVwqJGofb4',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/_zVwqJGofb4?source=web&stoken=dQ8CICeo5FXQGA-Uksqh5MlvRv3W7oQTm6SNylmnnMnpiLOTDWigQd-Rq5DdSHcu',
    description: 'Estructura Moonshine (TRAY CAR) | Precio ref: $800 USD',
    icon: 'shopping-cart'
  },
  {
    id: 'EST-002',
    name: 'Trasporte Car',
    category: 'Carros & Material Handling',
    standardHours: 4.5,
    unitPrice: 735,
    sketchupCode: 'SKP-tb7YM5W-Wis',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/tb7YM5W-Wis?source=web&stoken=1gODLAj0k0Zu72KejNp6NLiJhMC7zLFqKk2HNYFMB6RkF8TDl23DKhYbcTr5x3Sk',
    description: 'Estructura Moonshine (Trasporte Car) | Precio ref: $735 USD',
    icon: 'shopping-cart'
  },
  {
    id: 'EST-003',
    name: 'ASSY TRAY',
    category: 'Estaciones & Ensamble',
    standardHours: 6,
    unitPrice: 800,
    sketchupCode: 'SKP-MQT9ebGm_V8',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/MQT9ebGm_V8?source=web&stoken=wvY7URS-R4XVHo835w5WKqtkGv5o2FSlk_FAuG_ZDH7cfRr11Nv34TTHG2B9kpDX',
    description: 'Estructura Moonshine (ASSY TRAY) | Precio ref: $800 USD',
    icon: 'cpu'
  },
  {
    id: 'EST-004',
    name: 'DEK',
    category: 'Estaciones & Ensamble',
    standardHours: 6,
    unitPrice: 5,
    sketchupCode: 'SKP-MQj09x9H0YM',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/MQj09x9H0YM?source=web&stoken=pOaCEhYjLjcpgregNlwbUZUuye_-2eLfRnw0Rd4D6RFa0kgnLXDttLEMqtznJ2DJ',
    description: 'Estructura Moonshine (DEK) | Precio ref: $5 USD',
    icon: 'cpu'
  },
  {
    id: 'EST-005',
    name: 'LAPTOP CAR',
    category: 'Carros & Material Handling',
    standardHours: 4.5,
    unitPrice: 744,
    sketchupCode: 'SKP-jlfjrJXEnjc',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/jlfjrJXEnjc?stoken=Mmejb0PzJvGeZ8sZ77ic3Jn1nQIkP06e0v78VOgaMaECt-Vv-icABrWd_4J1pHJN&source=web',
    description: 'Estructura Moonshine (LAPTOP CAR) | Precio ref: $744 USD',
    icon: 'shopping-cart'
  },
  {
    id: 'EST-006',
    name: 'Disassembly 2',
    category: 'Estaciones & Ensamble',
    standardHours: 6,
    unitPrice: 827,
    sketchupCode: 'SKP-Z3ZS22mb2mk',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/Z3ZS22mb2mk?stoken=ogE_04fBEwcYSpiYMaFjjPkNuR9M8w46vs5vVPsIPg4hBtJWO8ivXv9yhL4HKYVb&source=web',
    description: 'Estructura Moonshine (Disassembly 2) | Precio ref: $827 USD',
    icon: 'cpu'
  },
  {
    id: 'EST-007',
    name: 'Porta Zebra',
    category: 'Dispositivos & Accesorios',
    standardHours: 3.5,
    unitPrice: 250,
    sketchupCode: 'SKP-dE-ovLMe3II',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/dE-ovLMe3II?source=web&stoken=UFiDZmaK60j3yGKNxC6mW0EFWIwO6QBZ6HfqefuhiKJILE9a_qk57HrH6CvtmwvA',
    description: 'Estructura Moonshine (Porta Zebra) | Precio ref: $250 USD',
    icon: 'box'
  },
  {
    id: 'EST-008',
    name: 'Fuse Assembly',
    category: 'Estaciones & Ensamble',
    standardHours: 6,
    unitPrice: 59,
    sketchupCode: 'SKP-BvFzUmnUOVk',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/BvFzUmnUOVk?stoken=2J_qJ2VH6v-hG-0-_Beahu5dL303yeRi82F6r8hAfr2_U5Fqpd8RcvWwB28KCb0o&source=web',
    description: 'Estructura Moonshine (Fuse Assembly) | Precio ref: $59 USD',
    icon: 'cpu'
  },
  {
    id: 'EST-009',
    name: 'CAJA PARA MATERIAL',
    category: 'Dispositivos & Accesorios',
    standardHours: 3.5,
    unitPrice: 200,
    sketchupCode: 'SKP-VG7ufhG5_jQ',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/VG7ufhG5_jQ?source=web&stoken=4Xa3jP6olsOluAjnkxgJMXqGUltreDhJSf1sjaslz47a--Qs8tOBKQYpntNycHPv',
    description: 'Estructura Moonshine (CAJA PARA MATERIAL) | Precio ref: $200 USD',
    icon: 'box'
  },
  {
    id: 'EST-010',
    name: 'FISH CHASIS CART',
    category: 'Carros & Material Handling',
    standardHours: 4.5,
    unitPrice: 667,
    sketchupCode: 'SKP-R-XepLQ4BXg',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/R-XepLQ4BXg?source=web&stoken=46bLt8JKP3ZYEdtlYCFfsAUEq1X6YBiLWd4XZQ4LmfMGU_97r_V8cQ7t_dcuDzoN',
    description: 'Estructura Moonshine (FISH CHASIS CART) | Precio ref: $667 USD',
    icon: 'shopping-cart'
  },
  {
    id: 'EST-011',
    name: 'FISHFAN CART',
    category: 'Carros & Material Handling',
    standardHours: 4.5,
    unitPrice: 2000,
    sketchupCode: 'SKP-V1Fp126folg',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/V1Fp126folg?source=web&stoken=NEQqYVp2SPHi9DpImpBvCoJ2bEWnaJiBXcGxhPd1zGkhIyuuize8nSjA3f0RUiak',
    description: 'Estructura Moonshine (FISHFAN CART) | Precio ref: $2000 USD',
    icon: 'shopping-cart'
  },
  {
    id: 'EST-012',
    name: 'COVER&EJECTOR CART',
    category: 'Carros & Material Handling',
    standardHours: 4.5,
    unitPrice: 1500,
    sketchupCode: 'SKP-GVSvoaUdC54',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/GVSvoaUdC54?source=web&stoken=oTYKX5MtUyHA3F4uep3hr4dcJGZ4NoNeJ4-KAiBQZpoEMI-arPGKm02DHIu2FuMP',
    description: 'Estructura Moonshine (COVER&EJECTOR CART) | Precio ref: $1500 USD',
    icon: 'shopping-cart'
  },
  {
    id: 'EST-013',
    name: 'PUFFIN-MANIFOLD IN&OUT CART',
    category: 'Carros & Material Handling',
    standardHours: 4.5,
    unitPrice: 375,
    sketchupCode: 'SKP-MQT9ebGm_V8',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/MQT9ebGm_V8?source=web&stoken=do5q2rjs8JXcHTUHFxW6CatkGv5o2FSlk_FAuG_ZDH7cfRr11Nv34TTHG2B9kpDX',
    description: 'Estructura Moonshine (PUFFIN-MANIFOLD IN&OUT CART) | Precio ref: $375 USD',
    icon: 'shopping-cart'
  },
  {
    id: 'EST-014',
    name: 'LEAK CART',
    category: 'Carros & Material Handling',
    standardHours: 4.5,
    unitPrice: 38,
    sketchupCode: 'SKP-NRQqwb159pI',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/NRQqwb159pI?source=web&stoken=qSrjINS1I69s1ef-RCeufUYPHHX-CtzgZPnGYgVcksmwX4K8s_c1PcPikaUXH3j-',
    description: 'Estructura Moonshine (LEAK CART) | Precio ref: $38 USD',
    icon: 'shopping-cart'
  },
  {
    id: 'EST-015',
    name: 'SQUARE DOUBLE TABLE',
    category: 'Mesas & Workstations',
    standardHours: 5.5,
    unitPrice: 300,
    sketchupCode: 'SKP-HeLH7C_33ek',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/HeLH7C_33ek?source=web&stoken=YFKB5ukgcEw93B0yPSwPCZDvlIzLNPiFUzSQAgM1S7_rJFoPZMHA9HB3-OsVySvN',
    description: 'Estructura Moonshine (SQUARE DOUBLE TABLE) | Precio ref: $300 USD',
    icon: 'layout'
  },
  {
    id: 'EST-016',
    name: 'Conveyor 2 Niveles',
    category: 'Racks & Conveyors',
    standardHours: 6.5,
    unitPrice: 2800,
    sketchupCode: 'SKP-3Nck-rvHDxY',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/3Nck-rvHDxY?source=web&stoken=yWZxe5Nc5CScCXo26DjbzmkKX8yF3sLIigq3mhubXa6fdfblWFidqKTThEQWqXI4',
    description: 'Estructura Moonshine (Conveyor 2 Niveles) | Precio ref: $2800 USD',
    icon: 'layers'
  },
  {
    id: 'EST-017',
    name: 'Mesa SMT 1',
    category: 'Mesas & Workstations',
    standardHours: 5.5,
    unitPrice: 167,
    sketchupCode: 'SKP-bc41jMsd-Bw',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/bc41jMsd-Bw?source=web&stoken=YR-1kBX5FMa-sNapjuH9A8E4tcgvdL3R2lWehhhr9D-iQxDUrPeCIkJsfvzIz7Ym',
    description: 'Estructura Moonshine (Mesa SMT 1) | Precio ref: $167 USD',
    icon: 'layout'
  },
  {
    id: 'EST-018',
    name: 'Carro Chassis',
    category: 'Carros & Material Handling',
    standardHours: 4.5,
    unitPrice: 800,
    sketchupCode: 'SKP-R-XepLQ4BXg',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/R-XepLQ4BXg?source=web&stoken=46bLt8JKP3ZYEdtlYCFfsAUEq1X6YBiLWd4XZQ4LmfMGU_97r_V8cQ7t_dcuDzoN',
    description: 'Estructura Moonshine (Carro Chassis) | Precio ref: $800 USD',
    icon: 'shopping-cart'
  },
  {
    id: 'EST-019',
    name: 'QA Pressfit',
    category: 'Estaciones & Ensamble',
    standardHours: 6,
    unitPrice: 700,
    sketchupCode: 'SKP-hkpq36hhDDk',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/hkpq36hhDDk?source=web&stoken=M0o0SvAAt4_cw12fRyyqpMQ6I-7mTiAvvXvYIgDy0YQwyBnN_dAtZLkn0uBUj4wU',
    description: 'Estructura Moonshine (QA Pressfit) | Precio ref: $700 USD',
    icon: 'cpu'
  },
  {
    id: 'EST-020',
    name: 'Conveyor pequeño',
    category: 'Racks & Conveyors',
    standardHours: 6.5,
    unitPrice: 500,
    sketchupCode: 'SKP-I4EQ-l3al04',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/I4EQ-l3al04?source=web&stoken=U6Qsf7FLTuzGKxi6QxFeyMDwMNCKlBCh3sUOgENvMFo82NBDAQUHSgdCY78yR7Ev',
    description: 'Estructura Moonshine (Conveyor pequeño) | Precio ref: $500 USD',
    icon: 'layers'
  },
  {
    id: 'EST-021',
    name: 'Conveyor Assy PCBA',
    category: 'Racks & Conveyors',
    standardHours: 6.5,
    unitPrice: 741,
    sketchupCode: 'SKP-nqB4wcna-eM',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/nqB4wcna-eM?stoken=DSmWZSnTqEyVdp0pYTYZ3JOIqKJEavBkHU2v0iJWVz-tN_fJmvVe6wUqTrNQH0_0&source=web',
    description: 'Estructura Moonshine (Conveyor Assy PCBA) | Precio ref: $741 USD',
    icon: 'layers'
  },
  {
    id: 'EST-022',
    name: 'REPAIR',
    category: 'Estaciones & Ensamble',
    standardHours: 6,
    unitPrice: 181,
    sketchupCode: 'SKP-r9jESbsJ8JY',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/r9jESbsJ8JY?stoken=nUGB2ZwzyQ72Ebh6ab_sCI_VGajvRR8ocwUVLWDhQdFxqINUeUykvWJJ0d1bWlJj&source=web',
    description: 'Estructura Moonshine (REPAIR) | Precio ref: $181 USD',
    icon: 'cpu'
  },
  {
    id: 'EST-023',
    name: 'Carro charolas Seguridad',
    category: 'Carros & Material Handling',
    standardHours: 4.5,
    unitPrice: 56,
    sketchupCode: 'SKP-5d_nzk-euSE',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/5d_nzk-euSE?source=web&stoken=Mf6Lgzt8hzEo7snnu2qdPTMyXngE7zUMw7KDWO5LBU4dJCvAHmB_3BD95FHgw_XK',
    description: 'Estructura Moonshine (Carro charolas Seguridad) | Precio ref: $56 USD',
    icon: 'shopping-cart'
  },
  {
    id: 'EST-024',
    name: 'Bote Backend',
    category: 'Dispositivos & Accesorios',
    standardHours: 3.5,
    unitPrice: 118,
    sketchupCode: 'SKP-0eN5VqB2fcU',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/0eN5VqB2fcU?stoken=nM6_5acfFuleNwXtokhjnyJCig4_v8zwtjEh4t0XwGD_sLJJtz7g3Rq77vUbB6iH&source=web',
    description: 'Estructura Moonshine (Bote Backend) | Precio ref: $118 USD',
    icon: 'box'
  },
  {
    id: 'EST-025',
    name: 'ICT TABLE',
    category: 'Mesas & Workstations',
    standardHours: 5.5,
    unitPrice: 274,
    sketchupCode: 'SKP-MDDZpzYyJUE',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/MDDZpzYyJUE?source=web&stoken=QLjd5lG1wLhTUsYlSh4zvKcDI00r7xzOrHQbLMd02JrCWqphhdE3Qp7T245vvhnp',
    description: 'Estructura Moonshine (ICT TABLE) | Precio ref: $274 USD',
    icon: 'layout'
  },
  {
    id: 'EST-026',
    name: 'Caja seca',
    category: 'Dispositivos & Accesorios',
    standardHours: 3.5,
    unitPrice: 200,
    sketchupCode: 'SKP-ntntic-Zjag',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/ntntic-Zjag?source=web&stoken=UyCJeFmtlgXLH24Ic04QkT3j2Yv9pkOvn5Jvt7WZbCFQkrOk63u5rmEk6PPg4WDc',
    description: 'Estructura Moonshine (Caja seca) | Precio ref: $200 USD',
    icon: 'box'
  },
  {
    id: 'EST-027',
    name: 'Heatsink Car',
    category: 'Carros & Material Handling',
    standardHours: 4.5,
    unitPrice: 500,
    sketchupCode: 'SKP-2_eOm-k2ZTc',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/2_eOm-k2ZTc?source=web&stoken=-XOdupSoNOGMf45OplTz1Bk8sZSgRFA9rOOuwmTcsJc3gKUATEmyzmBJfKPz09Y7',
    description: 'Estructura Moonshine (Heatsink Car) | Precio ref: $500 USD',
    icon: 'shopping-cart'
  },
  {
    id: 'EST-028',
    name: 'HV MATERIAL',
    category: 'Estaciones & Ensamble',
    standardHours: 6,
    unitPrice: 3075,
    sketchupCode: 'SKP-BvFzUmnUOVk',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/BvFzUmnUOVk?stoken=2J_qJ2VH6v-hG-0-_Beahu5dL303yeRi82F6r8hAfr2_U5Fqpd8RcvWwB28KCb0o&source=web',
    description: 'Estructura Moonshine (HV MATERIAL) | Precio ref: $3075 USD',
    icon: 'cpu'
  },
  {
    id: 'EST-029',
    name: 'AOI Station',
    category: 'Estaciones & Ensamble',
    standardHours: 6,
    unitPrice: 422,
    sketchupCode: 'SKP-UGfG_Ox_3TM',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/UGfG_Ox_3TM?stoken=ObwG82BoYgP1_Li7oBk0vYYvy534P3Dr3o1-buhLJnBoLByvYd5MSBbgWwurGgSm&source=web',
    description: 'Estructura Moonshine (AOI Station) | Precio ref: $422 USD',
    icon: 'cpu'
  },
  {
    id: 'EST-030',
    name: 'ROMA',
    category: 'Estaciones & Ensamble',
    standardHours: 6,
    unitPrice: 236,
    sketchupCode: 'SKP-BvFzUmnUOVk',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/BvFzUmnUOVk?stoken=2J_qJ2VH6v-hG-0-_Beahu5dL303yeRi82F6r8hAfr2_U5Fqpd8RcvWwB28KCb0o&source=web',
    description: 'Estructura Moonshine (ROMA) | Precio ref: $236 USD',
    icon: 'cpu'
  },
  {
    id: 'EST-031',
    name: 'DEBUG',
    category: 'Estaciones & Ensamble',
    standardHours: 6,
    unitPrice: 557,
    sketchupCode: 'SKP-T6qwDM78usA',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/T6qwDM78usA?stoken=jUvyRlBUxhpfEwVGnsqEw-5YB9IRAA2NUKy-b6mGoFCALXn-9Xr3GUrAyF2J6FW6&source=web',
    description: 'Estructura Moonshine (DEBUG) | Precio ref: $557 USD',
    icon: 'cpu'
  },
  {
    id: 'EST-032',
    name: 'SMK SMT',
    category: 'Estaciones & Ensamble',
    standardHours: 6,
    unitPrice: 676,
    sketchupCode: 'SKP-pK0_iRNZVUE',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/pK0_iRNZVUE?source=web&stoken=l62fSmFNcHL_xIoWRVSioqGxLljij4b-ECV2xXySd4PtL_I1BbwBl4sJchoPfA27',
    description: 'Estructura Moonshine (SMK SMT) | Precio ref: $676 USD',
    icon: 'cpu'
  },
  {
    id: 'EST-033',
    name: 'SUPPORT DESK',
    category: 'Mesas & Workstations',
    standardHours: 5.5,
    unitPrice: 289,
    sketchupCode: 'SKP-SUPPORT-DESK',
    sketchupUrl: 'https://apps.powerapps.com/play/e/default-3f0e69e0-eb38-4eb2-b4ee-52919719d31e/a/14cafc3f-0076-42a3-9e10-c7573c2943cc?tenantId=3f0e69e0-eb38-4eb2-b4ee-52919719d31e&hint=6196ef25-e65f-4d9f-b88e-88e786ad986e&sourcetime=1698161765938&source=portal',
    description: 'Estructura Moonshine (SUPPORT DESK) | Precio ref: $289 USD',
    icon: 'layout'
  },
  {
    id: 'EST-034',
    name: 'Transfer Car',
    category: 'Carros & Material Handling',
    standardHours: 4.5,
    unitPrice: 169,
    sketchupCode: 'SKP-5d_nzk-euSE',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/5d_nzk-euSE?source=web&stoken=Mf6Lgzt8hzEo7snnu2qdPTMyXngE7zUMw7KDWO5LBU4dJCvAHmB_3BD95FHgw_XK',
    description: 'Estructura Moonshine (Transfer Car) | Precio ref: $169 USD',
    icon: 'shopping-cart'
  },
  {
    id: 'EST-035',
    name: 'Mac Label',
    category: 'Estaciones & Ensamble',
    standardHours: 6,
    unitPrice: 430,
    sketchupCode: 'SKP-ORLSuX6ahYQ',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/ORLSuX6ahYQ?stoken=eYN2kCudUwqCQ23jB6D7sxcL3Foye9WO1SSeEW5IWfSSCa_YfRYwe5RWOZPXDjtb&source=web',
    description: 'Estructura Moonshine (Mac Label) | Precio ref: $430 USD',
    icon: 'cpu'
  },
  {
    id: 'EST-036',
    name: 'PCBA 6 niveles',
    category: 'Racks & Conveyors',
    standardHours: 6.5,
    unitPrice: 990,
    sketchupCode: 'SKP-PQ4OgVNLBaw',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/PQ4OgVNLBaw?stoken=UIF0ugor-TrT4QMrowyKXIO6-ArN1JGrGwo_ajorhwt9Iag6skmjYvRfZ_rZEZ5I&source=web',
    description: 'Estructura Moonshine (PCBA 6 niveles) | Precio ref: $990 USD',
    icon: 'layers'
  },
  {
    id: 'EST-037',
    name: 'TIE TABLE',
    category: 'Mesas & Workstations',
    standardHours: 5.5,
    unitPrice: 93,
    sketchupCode: 'SKP-rJn8s0a5TEo',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/rJn8s0a5TEo?stoken=7gVICKyqzYui1r1yFkoo-hAgjQffJ_p2GvAIcpmG3P-J4jT5hw0vrqQjikujHxDX&source=web',
    description: 'Estructura Moonshine (TIE TABLE) | Precio ref: $93 USD',
    icon: 'layout'
  },
  {
    id: 'EST-038',
    name: 'SIPLACE PRO',
    category: 'Estaciones & Ensamble',
    standardHours: 6,
    unitPrice: 462,
    sketchupCode: 'SKP-VmOC_M6UUQg',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/VmOC_M6UUQg?stoken=TW0N0m9SIuTDttjoRgInnsjQsZA4uQOWvA5JU4tDJ8jyemusowXkSvbUgBWmsP-x&source=web',
    description: 'Estructura Moonshine (SIPLACE PRO) | Precio ref: $462 USD',
    icon: 'cpu'
  },
  {
    id: 'EST-039',
    name: 'ASM DOUBLE TABLE',
    category: 'Mesas & Workstations',
    standardHours: 5.5,
    unitPrice: 586,
    sketchupCode: 'SKP-g6hSjnxwKoY',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/g6hSjnxwKoY?stoken=F_92jM3i0hNLKv6nEsL_6AgiheqrsGViRnqFhsRiD2I-gMgKgTsK4Tqkh6vs25-B&source=web',
    description: 'Estructura Moonshine (ASM DOUBLE TABLE) | Precio ref: $586 USD',
    icon: 'layout'
  },
  {
    id: 'EST-040',
    name: 'Remove Pressfit',
    category: 'Estaciones & Ensamble',
    standardHours: 6,
    unitPrice: 904,
    sketchupCode: 'SKP-B6eNDBreZu8',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/B6eNDBreZu8?stoken=YOqM0WHDACPZrj7tPU-eefgTlb3-eV0CbACI-jSqmWIMr2hpJ8NVkAi7tyjM2LcA&source=web',
    description: 'Estructura Moonshine (Remove Pressfit) | Precio ref: $904 USD',
    icon: 'cpu'
  },
  {
    id: 'EST-041',
    name: 'ASM TABLE',
    category: 'Mesas & Workstations',
    standardHours: 5.5,
    unitPrice: 134,
    sketchupCode: 'SKP-g6hSjnxwKoY',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/g6hSjnxwKoY?stoken=F_92jM3i0hNLKv6nEsL_6AgiheqrsGViRnqFhsRiD2I-gMgKgTsK4Tqkh6vs25-B&source=web',
    description: 'Estructura Moonshine (ASM TABLE) | Precio ref: $134 USD',
    icon: 'layout'
  },
  {
    id: 'EST-042',
    name: 'RACK U21',
    category: 'Racks & Conveyors',
    standardHours: 6.5,
    unitPrice: 2000,
    sketchupCode: 'SKP-X2XBYEmmVxM',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/X2XBYEmmVxM?source=web&stoken=IyPpqVFF_jyitUklm5Dt3d03Sch_KHp7egisVOo69-wp7R2ZeN1YNb-L-CQ5jXws',
    description: 'Estructura Moonshine (RACK U21) | Precio ref: $2000 USD',
    icon: 'layers'
  },
  {
    id: 'EST-043',
    name: 'SQUARE TABLE',
    category: 'Mesas & Workstations',
    standardHours: 5.5,
    unitPrice: 744,
    sketchupCode: 'SKP-QBsL3lZTbTY',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/QBsL3lZTbTY?stoken=K8tPsqpQdILNKnIZUDEbWAPMsr08eR-iUU7xxGCTaUHHC6gTSJS9UGo7ocj3iNkY&source=web',
    description: 'Estructura Moonshine (SQUARE TABLE) | Precio ref: $744 USD',
    icon: 'layout'
  },
  {
    id: 'EST-044',
    name: 'Jalula de Seguridad',
    category: 'Racks & Conveyors',
    standardHours: 6.5,
    unitPrice: 676,
    sketchupCode: 'SKP-_3xehHfojl8',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/_3xehHfojl8?stoken=y10KxlTjR9jZBq0uJ7mySxBlouPW8V6PJGsxGiP_bE5oaE9wwGtlNiTlAXVYsVWm&source=web',
    description: 'Estructura Moonshine (Jalula de Seguridad) | Precio ref: $676 USD',
    icon: 'layers'
  },
  {
    id: 'EST-045',
    name: 'Table Minipot',
    category: 'Mesas & Workstations',
    standardHours: 5.5,
    unitPrice: 198,
    sketchupCode: 'SKP-gkb8w-h7P_k',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/gkb8w-h7P_k?source=web&stoken=DPig1VC_j8FHaB79yu8_yCKZA_p-CSARB5ZDizq3b37LNdWOYoIHczcfqkVvgrG0',
    description: 'Estructura Moonshine (Table Minipot) | Precio ref: $198 USD',
    icon: 'layout'
  },
  {
    id: 'EST-046',
    name: 'FRESH MARKET',
    category: 'Estaciones & Ensamble',
    standardHours: 6,
    unitPrice: 987,
    sketchupCode: 'SKP-oKS0AEh6bmQ',
    sketchupUrl: 'https://app.sketchup.com/share/tc/northAmerica/oKS0AEh6bmQ?stoken=hgaflSzGOWfUi7nRoJaRCi0JPA0Zh9sK2UutnWSW1tEP-bglmUywBNUSua1z2Ywf&source=web',
    description: 'Estructura Moonshine (FRESH MARKET) | Precio ref: $987 USD',
    icon: 'cpu'
  },
  {
    id: 'EST-047',
    name: 'Pizarron de 45 grados con Acrilico',
    category: 'Dispositivos & Accesorios',
    standardHours: 3.5,
    unitPrice: 698,
    sketchupCode: 'SKP-PIZARRON-DE-45-GRADOS-CON-ACRILICO',
    sketchupUrl: 'https://apps.powerapps.com/play/e/default-3f0e69e0-eb38-4eb2-b4ee-52919719d31e/a/14cafc3f-0076-42a3-9e10-c7573c2943cc?tenantId=3f0e69e0-eb38-4eb2-b4ee-52919719d31e&hint=6196ef25-e65f-4d9f-b88e-88e786ad986e&sourcetime=1791825518062&source=portal',
    description: 'Estructura Moonshine (Pizarron de 45 grados con Acrilico) | Precio ref: $698 USD',
    icon: 'box'
  },
  {
    id: 'EST-048',
    name: 'MEETING STATION',
    category: 'Estaciones & Ensamble',
    standardHours: 6,
    unitPrice: 1169,
    sketchupCode: 'SKP-MEETING-STATION',
    sketchupUrl: 'https://apps.powerapps.com/play/e/default-3f0e69e0-eb38-4eb2-b4ee-52919719d31e/a/14cafc3f-0076-42a3-9e10-c7573c2943cc?tenantId=3f0e69e0-eb38-4eb2-b4ee-52919719d31e&hint=6196ef25-e65f-4d9f-b88e-88e786ad986e&sourcetime=1791825518062&source=portal',
    description: 'Estructura Moonshine (MEETING STATION) | Precio ref: $1169 USD',
    icon: 'cpu'
  }
];

// Plantilla inicial de técnicos Moonshine (asignados por turno base, especialidad y meta)
function getDefaultTechnicians() {
  return [
    { id: 'TEC-001', name: 'Juan Pérez', turnoBase: 1, rol: 'Técnico de Ensamble Moonshine', especialidad: 'Estructuras Nuevas', metaHorasTurno: 7.5, activo: true },
    { id: 'TEC-002', name: 'Miguel Hernández', turnoBase: 1, rol: 'Técnico de Ensamble Moonshine', especialidad: 'Arreglos / Desarme', metaHorasTurno: 7.5, activo: true },
    { id: 'TEC-003', name: 'Roberto Gómez', turnoBase: 2, rol: 'Técnico de Ensamble Moonshine', especialidad: 'Estructuras Nuevas', metaHorasTurno: 7.5, activo: true },
    { id: 'TEC-004', name: 'Daniel Morales', turnoBase: 2, rol: 'Técnico de Ensamble Moonshine', especialidad: 'Flexible', metaHorasTurno: 7.5, activo: true },
    { id: 'TEC-005', name: 'Alejandro Ruiz', turnoBase: 3, rol: 'Técnico de Ensamble Moonshine', especialidad: 'Estructuras Nuevas', metaHorasTurno: 7.5, activo: true },
    { id: 'TEC-006', name: 'Fernando Castillo', turnoBase: 3, rol: 'Técnico de Ensamble Moonshine', especialidad: 'Arreglos / Desarme', metaHorasTurno: 7.5, activo: true }
  ];
}

// Horario semanal nominal con asignación nominal de técnicos y descansos rotativos
function getDefaultRosterSchedule() {
  const schedule = {};
  DAYS_OF_WEEK.forEach(day => {
    schedule[day] = {
      1: { working: ['TEC-001', 'TEC-002'], off: [] },
      2: { working: ['TEC-003', 'TEC-004'], off: [] },
      3: { working: ['TEC-005', 'TEC-006'], off: [] }
    };
  });
  // Descansos rotativos predeterminados
  schedule['Domingo'][1] = { working: ['TEC-001'], off: ['TEC-002'] };
  schedule['Domingo'][2] = { working: ['TEC-003'], off: ['TEC-004'] };
  schedule['Domingo'][3] = { working: ['TEC-005'], off: ['TEC-006'] };
  schedule['Miércoles'][2] = { working: ['TEC-003'], off: ['TEC-004'] };
  schedule['Jueves'][3] = { working: ['TEC-005'], off: ['TEC-006'] };
  return schedule;
}

// Matriz inicial de técnicos por día y turno (compatible)
function getDefaultRoster() {
  const schedule = getDefaultRosterSchedule();
  const roster = {};
  DAYS_OF_WEEK.forEach(day => {
    roster[day] = {};
    SHIFTS_DEF.forEach(shift => {
      const slot = schedule[day] && schedule[day][shift.id];
      const count = (slot && Array.isArray(slot.working)) ? slot.working.length : 2;
      roster[day][shift.id] = count;
    });
  });
  return roster;
}

// Pedidos iniciales de muestra para demostrar la secuenciación
function getDefaultOrders() {
  const now = new Date();
  const formatIsoDate = (offsetDays) => {
    const d = new Date(now);
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
  };

  return [
    {
      id: 'MSH-2026-001',
      solicitante: 'Carlos Mendoza',
      area: 'Línea SMT 02',
      estructuraId: 'EST-002',
      estructuraNombre: 'Rack Dinámico FIFO por Gravedad (4 Niveles)',
      cantidad: 1,
      horasEstimadas: 7.0,
      prioridad: 'Crítica', // Línea parada
      estado: 'En Fabricación',
      fechaSolicitud: formatIsoDate(-1),
      fechaRequerida: formatIsoDate(1),
      canalEntrada: 'WhatsApp (Urgencia)',
      sketchupRef: 'MSH-SKP-RACK-FIFO-02',
      notas: 'Urgente para arranque de nuevo lote automotriz el jueves.',
      progresoHoras: 4.5,
      turnoAsignado: 1,
      diaAsignado: 'Lunes'
    },
    {
      id: 'MSH-2026-002',
      solicitante: 'Mariana Silva',
      area: 'Ensamble Backend B',
      estructuraId: 'EST-003',
      estructuraNombre: 'Estación de Trabajo / Mesa de Ensamble Ergonómica',
      cantidad: 2,
      horasEstimadas: 17.0, // 2 * 8.5
      prioridad: 'Alta',
      estado: 'Programado',
      fechaSolicitud: formatIsoDate(0),
      fechaRequerida: formatIsoDate(3),
      canalEntrada: 'Portal Web Moonshine',
      sketchupRef: 'MSH-SKP-WS-ERG-01',
      notas: 'Incluir toma de aire comprimido dual y repisa para escáner.',
      progresoHoras: 0,
      turnoAsignado: null,
      diaAsignado: null
    },
    {
      id: 'MSH-2026-003',
      solicitante: 'Jorge Trejo',
      area: 'Almacén Central',
      estructuraId: 'EST-001',
      estructuraNombre: 'Carro de Transporte ESD (Kitting)',
      cantidad: 3,
      horasEstimadas: 13.5, // 3 * 4.5
      prioridad: 'Normal',
      estado: 'Programado',
      fechaSolicitud: formatIsoDate(0),
      fechaRequerida: formatIsoDate(5),
      canalEntrada: 'Correo Outlook',
      sketchupRef: 'MSH-SKP-CART-ESD-01',
      notas: 'Color azul ESD con conectores a tierra.',
      progresoHoras: 0,
      turnoAsignado: null,
      diaAsignado: null
    },
    {
      id: 'MSH-2026-004',
      solicitante: 'Valeria Rocha',
      area: 'Calidad NPI',
      estructuraId: 'EST-005',
      estructuraNombre: 'Dispositivo Poka-Yoke / Fixture Mecánico',
      cantidad: 1,
      horasEstimadas: 5.5,
      prioridad: 'Alta',
      estado: 'Programado',
      fechaSolicitud: formatIsoDate(0),
      fechaRequerida: formatIsoDate(2),
      canalEntrada: 'SharePoint List Sync',
      sketchupRef: 'MSH-SKP-POKA-01',
      notas: 'Fixture para verificación de conector de potencia.',
      progresoHoras: 0,
      turnoAsignado: null,
      diaAsignado: null
    },
    {
      id: 'MSH-2026-005',
      solicitante: 'Héctor Nuñez',
      area: 'Taller 5S',
      estructuraId: 'EST-004',
      estructuraNombre: 'Shadow Board / Tablero de Herramientas 5S',
      cantidad: 2,
      horasEstimadas: 6.0,
      prioridad: 'Baja',
      estado: 'Pendiente',
      fechaSolicitud: formatIsoDate(0),
      fechaRequerida: formatIsoDate(7),
      canalEntrada: 'Portal Web Moonshine',
      sketchupRef: 'MSH-SKP-5S-BOARD-03',
      notas: 'Para organizar llaves y dados en la celda 4.',
      progresoHoras: 0,
      turnoAsignado: null,
      diaAsignado: null
    }
  ];
}

// Configuración general
const DEFAULT_SETTINGS = {
  plantName: 'Axiom Moonshine Innovation Shop',
  shiftGrossHours: 8.0,
  shiftEffectiveHours: 7.5,
  sharepointSiteUrl: 'https://axiom.sharepoint.com/sites/MoonshineOperations',
  sharepointListName: 'Pedidos_Moonshine',
  powerAutomateWebhook: '',
  notificationEmail: 'supervisores_moonshine@axiom.com',
  supervisorPin: '12345678'
};

// ==========================================
// 2. GESTOR DE ALMACENAMIENTO (LOCALSTORAGE)
// ==========================================
class MoonshineStore {
  static get(key, defaultValue) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.warn(`Error reading key ${key} from storage:`, e);
      return defaultValue;
    }
  }

  static set(key, value, skipCloud = false) {
    try {
      const nextStr = JSON.stringify(value);
      const prevStr = localStorage.getItem(key);
      localStorage.setItem(key, nextStr);
      if (!skipCloud && prevStr !== nextStr && typeof SupabaseCloudSync !== 'undefined' && key !== STORAGE_KEYS.ACTIVE_TECH && key !== STORAGE_KEYS.PLAN) {
        SupabaseCloudSync.pushKey(key, value);
      }
    } catch (e) {
      console.error(`Error saving key ${key}:`, e);
    }
  }

  static getCatalog() {
    return this.get(STORAGE_KEYS.CATALOG, DEFAULT_CATALOG);
  }

  static saveCatalog(catalog) {
    this.set(STORAGE_KEYS.CATALOG, catalog);
  }

  static getOrders() {
    return this.get(STORAGE_KEYS.ORDERS, getDefaultOrders());
  }

  static saveOrders(orders) {
    this.set(STORAGE_KEYS.ORDERS, orders);
  }

  static getRoster() {
    const schedule = this.getRosterSchedule();
    const roster = {};
    DAYS_OF_WEEK.forEach(day => {
      roster[day] = {};
      SHIFTS_DEF.forEach(shift => {
        const slot = schedule[day] && schedule[day][shift.id];
        let count = 2;
        if (slot) {
          if (Array.isArray(slot)) count = slot.length;
          else if (Array.isArray(slot.working)) count = slot.working.length;
          else if (typeof slot === 'number') count = slot;
        }
        roster[day][shift.id] = count;
      });
    });
    return roster;
  }

  static saveRoster(roster) {
    this.set(STORAGE_KEYS.ROSTER, roster);
  }

  static getTechnicians() {
    return this.get(STORAGE_KEYS.TECHNICIANS, getDefaultTechnicians());
  }

  static saveTechnicians(techs) {
    this.set(STORAGE_KEYS.TECHNICIANS, techs);
  }

  static getRosterSchedule() {
    return this.get(STORAGE_KEYS.ROSTER_SCHEDULE, getDefaultRosterSchedule());
  }

  static saveRosterSchedule(schedule) {
    this.set(STORAGE_KEYS.ROSTER_SCHEDULE, schedule);
  }

  static addTechnician(tech) {
    const techs = this.getTechnicians();
    const nextNum = (techs.length + 1).toString().padStart(3, '0');
    const newTech = {
      id: tech.id || `TEC-${nextNum}`,
      name: (tech.name || 'Nuevo Técnico').trim(),
      turnoBase: parseInt(tech.turnoBase, 10) || 1,
      rol: (tech.rol || 'Técnico de Ensamble Moonshine').trim(),
      especialidad: tech.especialidad || 'Estructuras Nuevas',
      metaHorasTurno: parseFloat(tech.metaHorasTurno) || 7.5,
      activo: true
    };
    techs.push(newTech);
    this.saveTechnicians(techs);

    // Asignar en el horario semanal en su turno base
    const schedule = this.getRosterSchedule();
    DAYS_OF_WEEK.forEach(day => {
      if (!schedule[day]) schedule[day] = {};
      if (!schedule[day][newTech.turnoBase]) schedule[day][newTech.turnoBase] = { working: [], off: [] };
      const slot = schedule[day][newTech.turnoBase];
      if (!Array.isArray(slot.working)) slot.working = [];
      if (!Array.isArray(slot.off)) slot.off = [];
      if (!slot.working.includes(newTech.id) && !slot.off.includes(newTech.id)) {
        slot.working.push(newTech.id);
      }
    });
    this.saveRosterSchedule(schedule);
    return newTech;
  }

  static updateTechnician(id, data) {
    const techs = this.getTechnicians();
    const idx = techs.findIndex(t => t.id === id);
    if (idx !== -1) {
      techs[idx] = { ...techs[idx], ...data };
      this.saveTechnicians(techs);
    }
  }

  static deleteTechnician(id) {
    let techs = this.getTechnicians();
    techs = techs.filter(t => t.id !== id);
    this.saveTechnicians(techs);

    // Remover del horario semanal
    const schedule = this.getRosterSchedule();
    DAYS_OF_WEEK.forEach(day => {
      if (schedule[day]) {
        SHIFTS_DEF.forEach(shift => {
          const slot = schedule[day][shift.id];
          if (slot) {
            if (Array.isArray(slot.working)) slot.working = slot.working.filter(tid => tid !== id);
            if (Array.isArray(slot.off)) slot.off = slot.off.filter(tid => tid !== id);
          }
        });
      }
    });
    this.saveRosterSchedule(schedule);
  }

  // Métodos de Gestión de Horas Extra (Overtime)
  static getOvertime() {
    return this.get(STORAGE_KEYS.OVERTIME, []);
  }

  static saveOvertime(otList) {
    this.set(STORAGE_KEYS.OVERTIME, otList);
  }

  static addOvertime({ techId, dayName, dateStr, hours, notes }) {
    const list = this.getOvertime();
    const newOt = {
      id: 'OT-' + Date.now(),
      techId,
      dayName: dayName || 'Lunes',
      dateStr: dateStr || new Date().toISOString().split('T')[0],
      hours: parseFloat(hours) || 0,
      notes: (notes || '').trim(),
      createdAt: new Date().toISOString()
    };
    list.push(newOt);
    this.saveOvertime(list);
    return newOt;
  }

  // Técnico actualmente seleccionado en la Terminal de Piso de Taller
  static getActiveTechnicianId() {
    return this.get(STORAGE_KEYS.ACTIVE_TECH, 'TEC-001');
  }

  static setActiveTechnicianId(techId) {
    this.set(STORAGE_KEYS.ACTIVE_TECH, techId);
  }

  // Registro de avance parcial o término por el técnico
  static updateOrderProgress(orderId, { hoursWorked, isComplete, techId, notes }) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return null;

    if (hoursWorked) {
      order.progresoHoras = parseFloat(((order.progresoHoras || 0) + parseFloat(hoursWorked)).toFixed(1));
    }

    if (techId) {
      order.tecnicoAsignadoId = techId;
      const tech = this.getTechnicians().find(t => t.id === techId);
      if (tech) order.tecnicoAsignadoNombre = tech.name;
    }

    if (notes) {
      order.notas = (order.notas ? order.notas + ' | ' : '') + notes;
    }

    const totalNeeded = order.horasEstimadas || 4;
    if (isComplete || (order.progresoHoras >= totalNeeded)) {
      order.estado = 'Listo para Entrega';
      order.fechaTerminoReal = new Date().toISOString();
      order.progresoHoras = totalNeeded;
    } else {
      order.estado = 'En Fabricación';
    }

    this.saveOrders(orders);
    return order;
  }

  // Resumen de Eficiencia y Rendimiento por Técnico (Vista Supervisor)
  static getTechniciansEfficiencySummary() {
    const techs = this.getTechnicians();
    const orders = this.getOrders();
    const overtimeList = this.getOvertime();

    return techs.map(t => {
      // Horas estándar completadas por este técnico
      const techCompletedOrders = orders.filter(o => 
        o.tecnicoAsignadoId === t.id && (o.estado === 'Listo para Entrega' || o.estado === 'Entregado')
      );
      const standardHoursCompleted = techCompletedOrders.reduce((sum, o) => sum + (parseFloat(o.horasEstimadas) || 0), 0);

      // Horas en progreso
      const inProgressOrders = orders.filter(o => 
        o.tecnicoAsignadoId === t.id && o.estado === 'En Fabricación'
      );
      const inProgressHours = inProgressOrders.reduce((sum, o) => sum + (parseFloat(o.progresoHoras) || 0), 0);

      // Horas extra registradas
      const techOvertime = overtimeList
        .filter(ot => ot.techId === t.id)
        .reduce((sum, ot) => sum + (parseFloat(ot.hours) || 0), 0);

      const baseShiftHours = t.metaHorasTurno || 7.5;
      const totalAvailableHours = parseFloat((baseShiftHours + techOvertime).toFixed(1));
      const totalProducedHours = parseFloat((standardHoursCompleted + inProgressHours).toFixed(1));

      let efficiencyPct = totalAvailableHours > 0 ? Math.min(130, Math.round((totalProducedHours / totalAvailableHours) * 100)) : 0;
      if (totalProducedHours === 0) efficiencyPct = 0;

      let statusColor = 'emerald';
      let statusLabel = 'Óptimo (>90%)';
      if (efficiencyPct === 0) {
        statusColor = 'slate';
        statusLabel = 'Por Iniciar';
      } else if (efficiencyPct < 75) {
        statusColor = 'red';
        statusLabel = 'Bajo (<75%)';
      } else if (efficiencyPct < 90) {
        statusColor = 'amber';
        statusLabel = 'Regular (75-89%)';
      }

      return {
        techId: t.id,
        name: t.name,
        turnoBase: t.turnoBase,
        especialidad: t.especialidad || 'Estructuras Nuevas',
        baseHours: baseShiftHours,
        overtimeHours: techOvertime,
        totalAvailableHours,
        standardHoursCompleted: parseFloat(standardHoursCompleted.toFixed(1)),
        inProgressHours: parseFloat(inProgressHours.toFixed(1)),
        totalProducedHours,
        efficiencyPct,
        statusColor,
        statusLabel,
        completedOrdersCount: techCompletedOrders.length,
        activeOrdersCount: inProgressOrders.length
      };
    });
  }

  static toggleTechDayStatus(day, shiftId, techId) {
    const schedule = this.getRosterSchedule();
    if (!schedule[day]) schedule[day] = {};
    if (!schedule[day][shiftId]) schedule[day][shiftId] = { working: [], off: [] };
    const slot = schedule[day][shiftId];
    if (!Array.isArray(slot.working)) slot.working = [];
    if (!Array.isArray(slot.off)) slot.off = [];

    if (slot.working.includes(techId)) {
      slot.working = slot.working.filter(id => id !== techId);
      if (!slot.off.includes(techId)) slot.off.push(techId);
    } else if (slot.off.includes(techId)) {
      slot.off = slot.off.filter(id => id !== techId);
      slot.working.push(techId);
    } else {
      slot.working.push(techId);
    }

    this.saveRosterSchedule(schedule);
  }

  static addTechToShift(day, shiftId, techId) {
    const schedule = this.getRosterSchedule();
    if (!schedule[day]) schedule[day] = {};
    if (!schedule[day][shiftId]) schedule[day][shiftId] = { working: [], off: [] };
    const slot = schedule[day][shiftId];
    if (!Array.isArray(slot.working)) slot.working = [];
    if (!Array.isArray(slot.off)) slot.off = [];

    slot.off = slot.off.filter(id => id !== techId);
    if (!slot.working.includes(techId)) {
      slot.working.push(techId);
    }
    this.saveRosterSchedule(schedule);
  }

  static removeTechFromShift(day, shiftId, techId) {
    const schedule = this.getRosterSchedule();
    if (schedule[day] && schedule[day][shiftId]) {
      const slot = schedule[day][shiftId];
      if (Array.isArray(slot.working)) slot.working = slot.working.filter(id => id !== techId);
      if (Array.isArray(slot.off)) slot.off = slot.off.filter(id => id !== techId);
    }
    this.saveRosterSchedule(schedule);
  }

  static resetRosterToDefault() {
    this.saveTechnicians(getDefaultTechnicians());
    this.saveRosterSchedule(getDefaultRosterSchedule());
  }

  static getSettings() {
    const stored = this.get(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    return { ...DEFAULT_SETTINGS, ...(stored || {}) };
  }

  static saveSettings(settings) {
    this.set(STORAGE_KEYS.SETTINGS, settings);
  }

  static getSupervisorPin() {
    const settings = this.getSettings();
    return settings.supervisorPin || '12345678';
  }

  static setSupervisorPin(newPin) {
    const settings = this.getSettings();
    settings.supervisorPin = String(newPin).trim();
    this.saveSettings(settings);
  }

  static getPlan() {
    return this.get(STORAGE_KEYS.PLAN, null);
  }

  static savePlan(plan) {
    this.set(STORAGE_KEYS.PLAN, plan);
  }
}

// ==========================================
// 3. MOTOR DE SECUENCIACIÓN AUTOMÁTICA 24/7
// ==========================================
class SchedulingEngine {
  /**
   * Genera el plan continuo multi-semana por turnos (T1, T2, T3) de Lunes a Domingo
   * considerando capacidad dinámica (técnicos en turno + horas extra), especialidad de técnico,
   * secuenciación estricta de prioridades (Crítica > Alta > Normal > Baja), carry-over de horas
   * no terminadas y cálculo de fecha compromiso con +3 días de holgura.
   */
  static runAutoSchedule() {
    const orders = MoonshineStore.getOrders();
    const settings = MoonshineStore.getSettings();
    const effectiveHoursPerTech = settings.shiftEffectiveHours || 7.5;
    const rosterSchedule = MoonshineStore.getRosterSchedule();
    const technicians = MoonshineStore.getTechnicians();
    const overtimeList = MoonshineStore.getOvertime();
    const techMap = new Map(technicians.map(t => [t.id, t]));

    // Prioridades ponderadas (mayor peso se fabrica primero)
    const priorityWeights = {
      'Crítica': 4,
      'Alta': 3,
      'Normal': 2,
      'Baja': 1
    };

    // Separamos las órdenes por programar en turnos vs las que ya están Listas para Entrega
    const activeOrders = orders.filter(o => 
      o.estado !== 'Entregado' && 
      o.estado !== 'Cancelado' && 
      o.estado !== 'Listo para Entrega' &&
      o.estado !== 'Por Aprobar' && 
      o.estado !== 'Pendiente de Aprobación'
    );
    const readyForDeliveryOrders = orders.filter(o => o.estado === 'Listo para Entrega');

    // Ordenamiento del backlog:
    // 1. Órdenes con avance previo en proceso (Carry-over) van primero para concluirse
    // 2. Prioridad ponderada (Crítica > Alta > Normal > Baja)
    // 3. FIFO: Fecha de solicitud más antigua primero
    activeOrders.sort((a, b) => {
      const aWip = (a.progresoHoras > 0 && a.estado === 'En Fabricación') ? 1 : 0;
      const bWip = (b.progresoHoras > 0 && b.estado === 'En Fabricación') ? 1 : 0;
      if (bWip !== aWip) return bWip - aWip;

      const pDiff = (priorityWeights[b.prioridad] || 0) - (priorityWeights[a.prioridad] || 0);
      if (pDiff !== 0) return pDiff;

      return new Date(a.fechaSolicitud || a.fechaRequerida || '2099-01-01') - new Date(b.fechaSolicitud || b.fechaRequerida || '2099-01-01');
    });

    // Horas totales requeridas por el backlog
    const totalBacklogHours = activeOrders.reduce((sum, o) => {
      const needed = Math.max(0.5, (o.horasEstimadas || 4) - (o.progresoHoras || 0));
      return sum + needed;
    }, 0);

    // Fecha del Lunes de la semana en curso
    const now = new Date();
    const currentDayIdx = now.getDay();
    const diffToMonday = (currentDayIdx === 0 ? -6 : 1) - currentDayIdx;
    const mondayStart = new Date(now);
    mondayStart.setDate(now.getDate() + diffToMonday);
    mondayStart.setHours(0, 0, 0, 0);

    // Proyectar un horizonte continuo de semanas (mínimo 2 semanas, hasta 6 según backlog)
    const weeksNeeded = Math.max(2, Math.min(6, Math.ceil(totalBacklogHours / 120) + 1));
    const scheduleGrid = [];

    for (let w = 0; w < weeksNeeded; w++) {
      const weekNum = w + 1;
      DAYS_OF_WEEK.forEach((day, dayIndex) => {
        const slotDate = new Date(mondayStart.getTime() + (w * 7 + dayIndex) * 86400000);
        const dateIso = slotDate.toISOString().split('T')[0];
        const dateShortStr = slotDate.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });

        SHIFTS_DEF.forEach(shift => {
          const slotData = rosterSchedule[day] && rosterSchedule[day][shift.id];
          let workingIds = [];
          let offIds = [];
          if (slotData) {
            if (Array.isArray(slotData)) workingIds = slotData;
            else if (Array.isArray(slotData.working)) {
              workingIds = slotData.working;
              offIds = slotData.off || [];
            } else if (typeof slotData === 'number') {
              workingIds = technicians.filter(t => t.turnoBase === shift.id).slice(0, slotData).map(t => t.id);
            }
          } else {
            workingIds = technicians.filter(t => t.turnoBase === shift.id).map(t => t.id);
          }

          // Horas extra registradas para este día/fecha y turno
          const shiftOvertimeHours = overtimeList
            .filter(ot => (ot.dateStr === dateIso || ot.dayName === day) && (workingIds.includes(ot.techId)))
            .reduce((sum, ot) => sum + (parseFloat(ot.hours) || 0), 0);

          const techsCount = Math.max(1, workingIds.length);
          const totalCapacityHours = parseFloat(((techsCount * effectiveHoursPerTech) + shiftOvertimeHours).toFixed(1));
          const workingNames = workingIds.map(id => techMap.get(id)?.name || id);
          const offNames = offIds.map(id => techMap.get(id)?.name || id);

          scheduleGrid.push({
            weekIndex: w,
            weekNum: weekNum,
            weekLabel: `Semana ${weekNum}`,
            dateIso: dateIso,
            dateShortStr: dateShortStr,
            dateObj: slotDate,
            dayIndex,
            dayName: day,
            shiftId: shift.id,
            shiftName: shift.name,
            shiftLabel: shift.label,
            shiftHoursStr: shift.hours,
            techsCount,
            workingIds,
            workingNames,
            offNames,
            overtimeHours: shiftOvertimeHours,
            totalCapacityHours,
            allocatedHours: 0,
            remainingCapacity: totalCapacityHours,
            items: []
          });
        });
      });
    }

    // Función auxiliar para sumar 3 días naturales/hábiles de holgura
    const addBufferDays = (baseDate, bufferDays = 3) => {
      const d = new Date(baseDate);
      let count = 0;
      while (count < bufferDays) {
        d.setDate(d.getDate() + 1);
        count++;
      }
      return d;
    };

    let currentSlotIndex = 0;
    const scheduledOrders = [];

    // Asignación continua de órdenes a los slots de turnos
    activeOrders.forEach(order => {
      const isCarryOver = ((order.progresoHoras || 0) > 0 && order.estado !== 'Listo para Entrega');
      let hoursNeeded = (order.horasEstimadas || 4) - (order.progresoHoras || 0);
      if (hoursNeeded <= 0) hoursNeeded = 0.5;

      let firstAssignedSlot = null;
      let lastAssignedSlot = null;
      const orderSplits = [];
      let assignedTech = null;

      const tipoTrabajo = order.tipoTrabajo || 'Estructura Nueva';

      while (hoursNeeded > 0.05 && currentSlotIndex < scheduleGrid.length) {
        const slot = scheduleGrid[currentSlotIndex];

        if (slot.remainingCapacity <= 0.1) {
          currentSlotIndex++;
          continue;
        }

        // Emparejamiento con técnico del turno según su especialidad
        if (!assignedTech && slot.workingIds.length > 0) {
          if (order.tecnicoAsignadoId && slot.workingIds.includes(order.tecnicoAsignadoId)) {
            assignedTech = techMap.get(order.tecnicoAsignadoId);
          } else {
            const candidates = slot.workingIds.map(id => techMap.get(id)).filter(Boolean);
            if (tipoTrabajo.includes('Arreglo') || tipoTrabajo.includes('Desarme') || tipoTrabajo.includes('Modificación')) {
              assignedTech = candidates.find(t => (t.especialidad || '').includes('Arreglos') || t.especialidad === 'Flexible') || candidates[0];
            } else {
              assignedTech = candidates.find(t => (t.especialidad || '').includes('Estructuras Nuevas') || t.especialidad === 'Flexible') || candidates[0];
            }
          }
        }

        if (!firstAssignedSlot) {
          firstAssignedSlot = slot;
        }
        lastAssignedSlot = slot;

        const hoursToAllocate = Math.min(hoursNeeded, slot.remainingCapacity);
        slot.allocatedHours = parseFloat((slot.allocatedHours + hoursToAllocate).toFixed(1));
        slot.remainingCapacity = parseFloat(Math.max(0, slot.remainingCapacity - hoursToAllocate).toFixed(1));
        hoursNeeded = parseFloat((hoursNeeded - hoursToAllocate).toFixed(1));

        const isFinishingHere = hoursNeeded <= 0.05;

        const splitInfo = {
          orderId: order.id,
          solicitante: order.solicitante,
          area: order.area,
          estructuraNombre: order.estructuraNombre,
          tipoTrabajo: tipoTrabajo,
          prioridad: order.prioridad,
          horasEnEsteTurno: parseFloat(hoursToAllocate.toFixed(1)),
          estado: order.estado,
          sketchupRef: order.sketchupRef,
          esTermino: isFinishingHere,
          esCarryOver: isCarryOver,
          tecnicoAsignadoId: assignedTech ? assignedTech.id : null,
          tecnicoAsignadoNombre: assignedTech ? assignedTech.name : 'Técnico de Turno',
          fechaTurno: slot.dateIso,
          semanaNum: slot.weekNum
        };

        slot.items.push(splitInfo);
        orderSplits.push({
          week: slot.weekNum,
          day: slot.dayName,
          date: slot.dateIso,
          shift: slot.shiftName,
          hours: splitInfo.horasEnEsteTurno,
          tecnico: splitInfo.tecnicoAsignadoNombre
        });

        if (slot.remainingCapacity <= 0.1) {
          currentSlotIndex++;
        }
      }

      const updatedOrder = { ...order };
      updatedOrder.tipoTrabajo = tipoTrabajo;
      if (assignedTech) {
        updatedOrder.tecnicoAsignadoId = assignedTech.id;
        updatedOrder.tecnicoAsignadoNombre = assignedTech.name;
      }
      updatedOrder.esCarryOver = isCarryOver;

      if (firstAssignedSlot && lastAssignedSlot) {
        updatedOrder.semanaProgramada = lastAssignedSlot.weekNum;
        updatedOrder.diaInicio = firstAssignedSlot.dayName;
        updatedOrder.turnoInicio = firstAssignedSlot.shiftName;
        updatedOrder.diaEntrega = lastAssignedSlot.dayName;
        updatedOrder.turnoEntrega = lastAssignedSlot.shiftName;
        updatedOrder.fechaFinFabricacion = lastAssignedSlot.dateIso;

        // Sumar +3 días de holgura de calidad para la fecha de compromiso
        const finishDate = new Date(lastAssignedSlot.dateObj);
        const commitmentDate = addBufferDays(finishDate, 3);
        const commitmentDateIso = commitmentDate.toISOString().split('T')[0];
        const daysEs = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const commitmentDayName = daysEs[commitmentDate.getDay()];
        const commitmentShortStr = commitmentDate.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });

        updatedOrder.fechaCompromisoEntrega = commitmentDateIso;
        updatedOrder.fechaCompromisoTexto = `${commitmentDayName} ${commitmentShortStr}`;
        updatedOrder.diasHolgura = 3;
        updatedOrder.fechaEntregaInterna = `${lastAssignedSlot.dayName} ${lastAssignedSlot.dateShortStr} (${lastAssignedSlot.shiftLabel})`;
        updatedOrder.fechaEntregaEstimada = `${commitmentDayName} ${commitmentShortStr}`;

        if (updatedOrder.estado === 'Pendiente') {
          updatedOrder.estado = 'Programado';
        }
      } else {
        updatedOrder.semanaProgramada = weeksNeeded;
        updatedOrder.diaEntrega = 'Semana Posterior';
        updatedOrder.turnoEntrega = 'T1';
        updatedOrder.fechaEntregaInterna = 'En backlog por capacidad de taller';
        updatedOrder.fechaEntregaEstimada = 'Por confirmar en plan';
        updatedOrder.fechaCompromisoEntrega = 'Por definir';
        updatedOrder.fechaCompromisoTexto = 'Por definir';
        updatedOrder.diasHolgura = 3;
      }

      updatedOrder.desgloseTurnos = orderSplits;
      scheduledOrders.push(updatedOrder);
    });

    // Órdenes que ya están Listas para Entrega conservan su fecha compromiso o entrega inmediata
    const normalizedReadyOrders = readyForDeliveryOrders.map(o => ({
      ...o,
      diasHolgura: 3,
      fechaCompromisoTexto: o.fechaCompromisoTexto || 'Listo para Entrega Inmediata',
      fechaEntregaEstimada: o.fechaCompromisoTexto ? `${o.fechaCompromisoTexto} (Listo)` : 'Listo para Entrega Inmediata'
    }));

    // Guardar órdenes y plan
    const completedOrders = orders.filter(o => o.estado === 'Entregado' || o.estado === 'Cancelado' || o.estado === 'Por Aprobar' || o.estado === 'Pendiente de Aprobación');
    const allUpdatedOrders = [...scheduledOrders, ...normalizedReadyOrders, ...completedOrders];
    MoonshineStore.saveOrders(allUpdatedOrders);

    const generatedPlan = {
      generatedAt: new Date().toISOString(),
      weeksCount: weeksNeeded,
      grid: scheduleGrid,
      totalOrdersScheduled: scheduledOrders.length
    };
    MoonshineStore.savePlan(generatedPlan);

    return generatedPlan;
  }

  /**
   * Identifica el turno que está ocurriendo en este momento según la hora del sistema
   */
  static getCurrentRealShift() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeVal = hours + minutes / 60;

    // T1: 07:00 a 15:00 (7:00 AM a 3:00 PM)
    // T2: 15:00 a 23:00 (3:00 PM a 11:00 PM)
    // T3: 23:00 a 07:00 (11:00 PM a 7:00 AM)
    let shiftId = 1;
    if (timeVal >= 7.0 && timeVal < 15.0) {
      shiftId = 1;
    } else if (timeVal >= 15.0 && timeVal < 23.0) {
      shiftId = 2;
    } else {
      shiftId = 3;
    }

    // Día de la semana en español
    const daysMap = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const currentDayName = daysMap[now.getDay()];

    return {
      shiftId,
      shift: SHIFTS_DEF.find(s => s.id === shiftId),
      dayName: currentDayName,
      dateString: now.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    };
  }
}

// ==========================================
// 4. GENERADOR DE CORREOS PARA OUTLOOK (PLAN DE ENTREGAS DE PEDIDOS PENDIENTES)
// ==========================================
class EmailReportGenerator {
  /**
   * Formatea la fecha compromiso con +3 días de holgura en texto amigable en español
   */
  static formatDeliveryDateWithBuffer(order) {
    if (order.estado === 'Listo para Entrega') {
      return '✅ Listo para Entrega Inmediata';
    }
    if (order.fechaCompromisoTexto && order.fechaCompromisoTexto !== 'Por definir') {
      return order.fechaCompromisoTexto;
    }
    if (order.fechaCompromisoEntrega && order.fechaCompromisoEntrega !== 'Por definir') {
      const parts = order.fechaCompromisoEntrega.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        if (!isNaN(d.getTime())) {
          const daysEs = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
          const shortStr = d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
          return `${daysEs[d.getDay()]} ${shortStr}`;
        }
      }
      return order.fechaCompromisoEntrega;
    }
    return order.fechaEntregaEstimada || 'En programación';
  }

  /**
   * Genera el HTML formateado para Outlook del Plan de Todos los Pedidos Pendientes
   * (Sin mostrar qué técnico hace cada estructura ni los turnos internos; muestra de quién es cada pedido y qué día se entrega con +3 días de holgura)
   */
  static generateDailyEmailHtml(filterMode = 'ALL') {
    if (!MoonshineStore.getPlan()) {
      SchedulingEngine.runAutoSchedule();
    }
    const orders = MoonshineStore.getOrders();
    const settings = MoonshineStore.getSettings();
    const todayFormatted = new Date().toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Filtrar todos los pedidos pendientes (que aún no se han entregado ni cancelado)
    let pendingOrders = orders.filter(o =>
      o.estado !== 'Entregado' &&
      o.estado !== 'Cancelado' &&
      o.estado !== 'Por Aprobar' &&
      o.estado !== 'Pendiente de Aprobación'
    );

    if (filterMode === 'URGENT') {
      pendingOrders = pendingOrders.filter(o => o.prioridad === 'Crítica' || o.prioridad === 'Alta');
    } else if (filterMode === 'WIP') {
      pendingOrders = pendingOrders.filter(o => o.estado === 'En Fabricación' || o.estado === 'Listo para Entrega');
    }

    // Ordenar: 1) Listo para Entrega, 2) En Fabricación, 3) Programado por fecha de compromiso ascendente y prioridad
    const statusOrder = { 'Listo para Entrega': 1, 'En Fabricación': 2, 'Programado': 3, 'Pendiente': 4 };
    const priorityWeights = { 'Crítica': 4, 'Alta': 3, 'Normal': 2, 'Baja': 1 };

    pendingOrders.sort((a, b) => {
      const sDiff = (statusOrder[a.estado] || 9) - (statusOrder[b.estado] || 9);
      if (sDiff !== 0) return sDiff;

      const dateA = a.fechaCompromisoEntrega && a.fechaCompromisoEntrega !== 'Por definir' ? a.fechaCompromisoEntrega : '2099-12-31';
      const dateB = b.fechaCompromisoEntrega && b.fechaCompromisoEntrega !== 'Por definir' ? b.fechaCompromisoEntrega : '2099-12-31';
      if (dateA !== dateB) return dateA.localeCompare(dateB);

      return (priorityWeights[b.prioridad] || 0) - (priorityWeights[a.prioridad] || 0);
    });

    const totalPending = pendingOrders.length;
    const totalInProcess = pendingOrders.filter(o => o.estado === 'En Fabricación').length;
    const totalReady = pendingOrders.filter(o => o.estado === 'Listo para Entrega').length;

    let rowsHtml = '';
    if (pendingOrders.length === 0) {
      rowsHtml = `
        <tr>
          <td colspan="6" style="padding: 20px 14px; color: #64748b; font-style: italic; text-align: center;">
            No hay pedidos pendientes en este momento.
          </td>
        </tr>
      `;
    } else {
      pendingOrders.forEach((o, idx) => {
        const rowBg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';

        let pBadgeColor = '#2563eb';
        let pLabel = o.prioridad || 'Normal';
        if (pLabel === 'Crítica') { pBadgeColor = '#dc2626'; pLabel = '🚨 Urgente'; }
        else if (pLabel === 'Alta') { pBadgeColor = '#ea580c'; pLabel = '⚡ Alta'; }
        else if (pLabel === 'Normal') { pBadgeColor = '#2563eb'; pLabel = '🔷 Media'; }
        else if (pLabel === 'Baja') { pBadgeColor = '#64748b'; pLabel = '⚪ Baja'; }

        const totalHrs = o.horasEstimadas || 4;
        const doneHrs = o.progresoHoras || 0;
        const pct = o.estado === 'Listo para Entrega' ? 100 : Math.min(99, Math.round((doneHrs / totalHrs) * 100));

        let statusBadgeHtml = '';
        if (o.estado === 'Listo para Entrega') {
          statusBadgeHtml = `<span style="background-color:#dcfce7;color:#166534;padding:4px 9px;border-radius:12px;font-size:11px;font-weight:bold;border:1px solid #86efac;display:inline-block;">✅ Listo para Entrega</span>`;
        } else if (o.estado === 'En Fabricación') {
          statusBadgeHtml = `<span style="background-color:#fef3c7;color:#92400e;padding:4px 9px;border-radius:12px;font-size:11px;font-weight:bold;border:1px solid #fde68a;display:inline-block;">🔨 En Fabricación (${pct}%)</span>`;
        } else {
          statusBadgeHtml = `<span style="background-color:#dbeafe;color:#1e40af;padding:4px 9px;border-radius:12px;font-size:11px;font-weight:bold;border:1px solid #bfdbfe;display:inline-block;">📋 Programado en Plan</span>`;
        }

        const deliveryDateFormatted = this.formatDeliveryDateWithBuffer(o);

        rowsHtml += `
          <tr style="background-color: ${rowBg}; border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 11px 12px; font-family: Consolas, monospace; font-weight: bold; color: #1e293b; font-size: 12px;">
              ${o.id}
            </td>
            <td style="padding: 11px 12px;">
              <div style="font-weight: 700; color: #0f172a; font-size: 13px;">👤 Pedido de: ${o.solicitante || 'Solicitante'}</div>
              <div style="font-size: 11px; color: #475569; margin-top: 2px;">📍 Área: <strong>${o.area || 'Planta'}</strong></div>
            </td>
            <td style="padding: 11px 12px;">
              <div style="font-weight: 700; color: #1e293b; font-size: 13px;">${o.estructuraNombre}</div>
              <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
                Cantidad: <strong>${o.cantidad || 1} pza(s)</strong> &bull; ${o.tipoTrabajo || 'Estructura Nueva'}
              </div>
            </td>
            <td style="padding: 11px 12px; text-align: center;">
              <span style="background-color: ${pBadgeColor}; color: #ffffff; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; display: inline-block;">
                ${pLabel}
              </span>
            </td>
            <td style="padding: 11px 12px; text-align: center;">
              ${statusBadgeHtml}
            </td>
            <td style="padding: 11px 12px; background-color: #f0fdf4; border-left: 3px solid #16a34a;">
              <div style="font-size: 11px; color: #15803d; font-weight: 600; text-transform: uppercase;">Se entrega el día:</div>
              <div style="font-size: 13px; font-weight: 800; color: #14532d; margin-top: 2px;">📅 ${deliveryDateFormatted}</div>
            </td>
          </tr>
        `;
      });
    }

    const fullHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; max-width: 920px; margin: 0 auto; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 10px; overflow: hidden;">
        <!-- Encabezado Corporativo -->
        <div style="background: linear-gradient(135deg, #0f172a, #1e3a8a); color: #ffffff; padding: 22px 26px;">
          <h2 style="margin: 0 0 6px 0; font-size: 20px; letter-spacing: -0.3px;">📦 Plan de Entregas — Pedidos Pendientes Moonshine</h2>
          <p style="margin: 0; font-size: 13px; color: #cbd5e1;">
            Actualizado al: <strong style="color:#ffffff;">${todayFormatted}</strong> &nbsp;|&nbsp; ${settings.plantName}
          </p>
        </div>

        <div style="padding: 22px 26px;">
          <p style="margin-top: 0; color: #334155; font-size: 13.5px; line-height: 1.55;">
            Estimado equipo: A continuación se comparte el <strong>estatus actual y la fecha programada de entrega</strong> de todos los pedidos de estructuras registrados en Moonshine:
          </p>

          <!-- Resumen Rápido -->
          <table style="width: 100%; border-collapse: separate; border-spacing: 8px 0; margin: 14px 0 18px 0;">
            <tr>
              <td style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; text-align: center; width: 33%;">
                <div style="font-size: 11px; color: #64748b; font-weight: bold; text-transform: uppercase;">Total Pedidos Pendientes</div>
                <div style="font-size: 20px; font-weight: 900; color: #0f172a; margin-top: 2px;">${totalPending}</div>
              </td>
              <td style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 10px 14px; text-align: center; width: 33%;">
                <div style="font-size: 11px; color: #92400e; font-weight: bold; text-transform: uppercase;">En Fabricación</div>
                <div style="font-size: 20px; font-weight: 900; color: #b45309; margin-top: 2px;">${totalInProcess}</div>
              </td>
              <td style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 10px 14px; text-align: center; width: 33%;">
                <div style="font-size: 11px; color: #166534; font-weight: bold; text-transform: uppercase;">Listos para Entrega</div>
                <div style="font-size: 20px; font-weight: 900; color: #15803d; margin-top: 2px;">${totalReady}</div>
              </td>
            </tr>
          </table>

          <!-- Tabla Principal de Pedidos Pendientes -->
          <table style="width: 100%; border-collapse: collapse; font-size: 12.5px; margin: 14px 0; border: 1px solid #e2e8f0;">
            <thead>
              <tr style="background-color: #0f172a; color: #ffffff;">
                <th style="padding: 11px 12px; text-align: left; width: 11%;">Folio</th>
                <th style="padding: 11px 12px; text-align: left; width: 24%;">Pedido de (Solicitante / Área)</th>
                <th style="padding: 11px 12px; text-align: left; width: 25%;">Estructura Solicitada</th>
                <th style="padding: 11px 12px; text-align: center; width: 10%;">Prioridad</th>
                <th style="padding: 11px 12px; text-align: center; width: 14%;">Estatus</th>
                <th style="padding: 11px 12px; text-align: left; width: 16%;">Fecha de Entrega</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 14px 18px; border-radius: 8px; font-size: 12px; color: #475569; margin-top: 18px;">
            📌 <strong>Información importante para solicitantes:</strong>
            <ul style="margin: 6px 0 0 0; padding-left: 20px; line-height: 1.6;">
              <li>Las solicitudes con prioridad <strong>Urgente (Línea Parada)</strong> tienen preferencia en la fila de producción.</li>
              <li>Al concluir la estructura y pasar a <strong>Listo para Entrega</strong>, se coordinará la entrega en el área destino.</li>
              <li>Puedes consultar en vivo el estatus de todos los pedidos en: <a href="https://gemaromoflex.github.io/moonshineplanner/?vista=entregas" style="color: #2563eb; font-weight: bold;">Portal de Estatus de Entregas Moonshine</a>.</li>
            </ul>
          </div>
        </div>

        <div style="background-color: #f1f5f9; padding: 12px 24px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
          Taller Moonshine &bull; Planificación de Entregas y Estatus de Pedidos &bull; ${settings.plantName}
        </div>
      </div>
    `;

    return fullHtml;
  }

  /**
   * Genera el HTML del Resumen Semanal (también enfocado a pedidos y entregas sin nombres de técnicos)
   */
  static generateWeeklyEmailHtml() {
    return this.generateDailyEmailHtml('ALL');
  }
}

// ==========================================
// 5. EXPORTADOR E IMPORTADOR DE SHAREPOINT / CSV
// ==========================================
class SharePointBridge {
  /**
   * Exporta las órdenes en formato CSV compatible directo con importación de listas de SharePoint
   */
  static exportToSharePointCsv() {
    const orders = MoonshineStore.getOrders();
    const headers = [
      'Title', // Folio en SharePoint
      'Solicitante',
      'Area',
      'EstructuraNombre',
      'Cantidad',
      'Prioridad',
      'Estado',
      'HorasEstimadas',
      'DiaEntrega',
      'TurnoEntrega',
      'FechaRequerida',
      'CanalEntrada',
      'SketchupRef',
      'Notas'
    ];

    const rows = orders.map(o => [
      `"${o.id || ''}"`,
      `"${o.solicitante || ''}"`,
      `"${o.area || ''}"`,
      `"${o.estructuraNombre || ''}"`,
      o.cantidad || 1,
      `"${o.prioridad || ''}"`,
      `"${o.estado || ''}"`,
      o.horasEstimadas || 0,
      `"${o.diaEntrega || ''}"`,
      `"${o.turnoEntrega || ''}"`,
      `"${o.fechaRequerida || ''}"`,
      `"${o.canalEntrada || ''}"`,
      `"${o.sketchupRef || ''}"`,
      `"${(o.notas || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Pedidos_Moonshine_SharePoint_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Importa archivo CSV exportado desde SharePoint
   */
  static parseSharePointCsv(csvText) {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) throw new Error('El archivo CSV no contiene filas de datos válidas.');

    const headers = lines[0].split(',').map(h => h.replace(/^["']|["']$/g, '').trim());
    const importedOrders = [];

    for (let i = 1; i < lines.length; i++) {
      // Regex para respetar comas dentro de comillas
      const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
      const cleanValues = values.map(v => v.replace(/^["']|["']$/g, '').trim());

      const rowObj = {};
      headers.forEach((h, idx) => {
        rowObj[h] = cleanValues[idx] || '';
      });

      importedOrders.push({
        id: rowObj['Title'] || rowObj['Folio'] || `MSH-IMP-${Date.now()}-${i}`,
        solicitante: rowObj['Solicitante'] || 'Importado SharePoint',
        area: rowObj['Area'] || 'General',
        estructuraNombre: rowObj['EstructuraNombre'] || rowObj['Estructura'] || 'Estructura Estándar',
        cantidad: parseInt(rowObj['Cantidad'] || '1', 10),
        prioridad: rowObj['Prioridad'] || 'Normal',
        estado: rowObj['Estado'] || 'Programado',
        horasEstimadas: parseFloat(rowObj['HorasEstimadas'] || '5.0'),
        diaEntrega: rowObj['DiaEntrega'] || '',
        turnoEntrega: rowObj['TurnoEntrega'] || '',
        fechaRequerida: rowObj['FechaRequerida'] || '',
        canalEntrada: 'SharePoint CSV Sync',
        sketchupRef: rowObj['SketchupRef'] || '',
        notas: rowObj['Notas'] || '',
        progresoHoras: 0
      });
    }

    return importedOrders;
  }
}

// ==========================================
// 5. GESTOR DE ESCANEO DE OUTLOOK & AUTOMATIZACIÓN
// ==========================================
class OutlookSyncManager {
  static STORAGE_KEY = 'msh_outlook_sync_v1';
  static DEFAULT_KEYWORDS = ['Moonshine', 'estructuras', 'mesas', 'carritos', 'racks', 'estaciones', 'perfil'];
  static timerId = null;
  static countdownInterval = null;
  static secondsRemaining = 300;

  static getState() {
    const defaultState = {
      autoScanEnabled: true,
      intervalMinutes: 5,
      lastScanTime: null,
      keywords: [...this.DEFAULT_KEYWORDS],
      emails: [],
      dismissedIds: [],
      networkInfo: {
        localUrl: 'http://localhost:8080/',
        networkUrl: 'http://localhost:8080/',
        ip: 'localhost',
        port: 8080
      }
    };
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.keywords || !Array.isArray(parsed.keywords) || parsed.keywords.length === 0) {
          parsed.keywords = [...this.DEFAULT_KEYWORDS];
        }
        return { ...defaultState, ...parsed };
      }
    } catch (e) {
      console.warn('Error al leer estado Outlook:', e);
    }
    return defaultState;
  }

  static saveState(state, skipCloud = false) {
    try {
      const nextStr = JSON.stringify(state);
      const prevStr = localStorage.getItem(this.STORAGE_KEY);
      localStorage.setItem(this.STORAGE_KEY, nextStr);
      if (!skipCloud && prevStr !== nextStr && typeof SupabaseCloudSync !== 'undefined') {
        SupabaseCloudSync.pushKey(this.STORAGE_KEY, state);
      }
    } catch (e) {
      console.warn('Error al guardar estado Outlook:', e);
    }
  }

  static async init() {
    await this.fetchNetworkInfo();
    this.setupTimer();
    this.renderInbox();
    this.updateNotificationBanner();

    // Primer escaneo al iniciar la app
    setTimeout(() => {
      const state = this.getState();
      if (state.autoScanEnabled) {
        this.scanNow(false);
      }
    }, 1500);
  }

  static async fetchNetworkInfo() {
    try {
      const isGitHub = window.location.hostname.includes('github.io');
      if (isGitHub) {
        const state = this.getState();
        state.networkInfo = { networkUrl: window.location.href, hostname: window.location.hostname };
        this.saveState(state);
        const bossEl = document.getElementById('displayBossUrl');
        if (bossEl) bossEl.textContent = window.location.href;
        return;
      }

      const res = await fetch('/api/network-info', { cache: 'no-store' });
      if (res.ok) {
        const info = await res.json();
        const state = this.getState();
        state.networkInfo = info;
        this.saveState(state);
        const bossEl = document.getElementById('displayBossUrl');
        if (bossEl && info.networkUrl) bossEl.textContent = info.networkUrl;
      }
    } catch (e) {
      const state = this.getState();
      state.networkInfo = { networkUrl: window.location.href };
      this.saveState(state);
      const bossEl = document.getElementById('displayBossUrl');
      if (bossEl) bossEl.textContent = window.location.href;
    }
  }

  static setupTimer() {
    if (this.timerId) clearInterval(this.timerId);
    if (this.countdownInterval) clearInterval(this.countdownInterval);

    const state = this.getState();
    if (!state.autoScanEnabled) {
      this.updateCountdownDisplay('Auto-escaneo pausado');
      return;
    }

    const intervalMinutes = state.intervalMinutes || 5;
    const intervalMs = intervalMinutes * 60 * 1000;
    this.secondsRemaining = intervalMinutes * 60;

    // Contador regresivo visual cada segundo
    this.countdownInterval = setInterval(() => {
      this.secondsRemaining--;
      if (this.secondsRemaining <= 0) {
        this.secondsRemaining = (this.getState().intervalMinutes || 5) * 60;
      }
      this.updateCountdownDisplay();
    }, 1000);

    // Ejecución periódica automática
    this.timerId = setInterval(() => {
      this.scanNow(false);
    }, intervalMs);

    this.updateCountdownDisplay();
  }

  static updateCountdownDisplay(customMsg = null) {
    const el = document.getElementById('outlookTimerDisplay');
    if (!el) return;
    if (customMsg) {
      el.textContent = customMsg;
      return;
    }
    const mins = Math.floor(this.secondsRemaining / 60);
    const secs = this.secondsRemaining % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    el.textContent = `Próxima revisión en: ${formatted}`;
  }

  static analyzeCloudEmail(rawEmail, kwList) {
    const subject = String(rawEmail.subject || rawEmail.Subject || 'Solicitud Moonshine');
    const body = String(rawEmail.body || rawEmail.Body || rawEmail.preview || '');
    const fullLower = `${subject} ${body}`.toLowerCase();

    const cleanKws = (kwList || this.DEFAULT_KEYWORDS).map(k => k.trim().toLowerCase()).filter(Boolean);
    const matched = cleanKws.filter(kw => fullLower.includes(kw));

    if (matched.length === 0 && !rawEmail.forceInclude) return null;

    let sugerencia = rawEmail.sugerenciaEstructura || 'Estación de Trabajo';
    if (/carro|carrito|kitting|tray/i.test(fullLower)) sugerencia = 'Carro con Charolas';
    else if (/rack|fifo/i.test(fullLower)) sugerencia = 'Rack FIFO';
    else if (/impresora/i.test(fullLower)) sugerencia = 'Carro Impresora';

    let prioridad = rawEmail.prioridadSugerida || 'Normal';
    if (/urgente|linea parada|línea parada|critico|crítico|paro/i.test(fullLower)) prioridad = 'Crítica';
    else if (/alta|kaizen|npi|asap/i.test(fullLower)) prioridad = 'Alta';

    let area = rawEmail.areaSugerida || 'Receiving';
    if (/kitting/i.test(fullLower)) area = 'Kitting';
    else if (/warehouse|almacen|almacén/i.test(fullLower)) area = 'Warehouse';
    else if (/vlp/i.test(fullLower)) area = 'VLP';
    else if (/smt/i.test(fullLower)) area = 'Línea SMT 01';

    const cleanBody = body.replace(/[\r\n\t]+/g, ' ').trim();
    return {
      id: rawEmail.id || rawEmail.EntryID || ('CLOUD-' + btoa(unescape(encodeURIComponent(subject + (rawEmail.receivedTime || '')))).slice(0, 16)),
      subject,
      sender: rawEmail.sender || rawEmail.From || 'Solicitante Outlook',
      senderEmail: rawEmail.senderEmail || '',
      receivedTime: rawEmail.receivedTime || 'Reciente',
      preview: cleanBody.length > 240 ? cleanBody.slice(0, 240) + '...' : cleanBody,
      body: cleanBody.slice(0, 1200),
      importance: prioridad,
      sugerenciaEstructura: sugerencia,
      prioridadSugerida: prioridad,
      areaSugerida: area,
      palabrasDetectadas: matched.join(', ')
    };
  }

  static async scanNow(manual = true) {
    const btn = document.getElementById('btnScanOutlookNow');
    if (btn) btn.disabled = true;

    try {
      const state = this.getState();
      const kwList = (state.keywords && state.keywords.length > 0) ? state.keywords : this.DEFAULT_KEYWORDS;
      const kwParam = encodeURIComponent(kwList.join(','));
      const isLocal8080 = window.location.protocol === 'http:' && window.location.port === '8080';
      const apiBase = isLocal8080 ? '' : 'http://localhost:8080';

      const res = await fetch(`${apiBase}/api/scan-outlook?keyword=${kwParam}&limit=25`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const badgeConn = document.getElementById('connectorStatusBadge');
      const btnDl = document.getElementById('btnDownloadConnector');
      if (badgeConn) badgeConn.classList.remove('hidden');
      if (btnDl) btnDl.classList.add('hidden');

      const updatedState = this.getState();
      updatedState.lastScanTime = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      if (data.success && Array.isArray(data.emails)) {
        const existingMap = new Map((updatedState.emails || []).map(e => [e.id, e]));
        let newFoundCount = 0;

        data.emails.forEach(em => {
          if (!updatedState.dismissedIds.includes(em.id) && !existingMap.has(em.id)) {
            existingMap.set(em.id, em);
            newFoundCount++;
          }
        });

        updatedState.emails = Array.from(existingMap.values());
        this.saveState(updatedState);

        if (newFoundCount > 0) {
          showToast(`🔔 ¡Se detectaron ${newFoundCount} nuevas solicitudes en Outlook!`, 'success');
        } else if (manual) {
          showToast('Outlook revisado: No hay solicitudes nuevas por el momento.', 'info');
        }
      } else if (manual && data.message) {
        showToast(data.message, 'info');
      }
    } catch (err) {
      const badgeConn = document.getElementById('connectorStatusBadge');
      const btnDl = document.getElementById('btnDownloadConnector');
      if (badgeConn) badgeConn.classList.add('hidden');
      if (btnDl) btnDl.classList.remove('hidden');

      if (manual) {
        showToast('Haz clic en "Activar Auto-Lectura Outlook (1 vez)" para instalar el lector automático en esta computadora.', 'info');
      }
    } finally {
      if (btn) btn.disabled = false;
      this.renderInbox();
      this.updateNotificationBanner();
    }
  }

  static renderInbox() {
    const state = this.getState();
    const container = document.getElementById('outlookEmailsContainer');
    const badge = document.getElementById('badgeInboxCount');
    const emptyState = document.getElementById('outlookEmptyState');
    const activeEmails = (state.emails || []).filter(e => !state.dismissedIds.includes(e.id));

    // Sincronizar controles de interfaz
    const checkEl = document.getElementById('checkAutoScan');
    if (checkEl) checkEl.checked = !!state.autoScanEnabled;

    const intervalEl = document.getElementById('selectScanInterval');
    if (intervalEl && state.intervalMinutes) intervalEl.value = String(state.intervalMinutes);

    const bossEl = document.getElementById('displayBossUrl');
    if (bossEl && state.networkInfo && state.networkInfo.networkUrl) {
      bossEl.textContent = state.networkInfo.networkUrl;
    }

    // Renderizar tags de palabras clave activas
    const kwContainer = document.getElementById('outlookKeywordsPills');
    if (kwContainer) {
      const currentKws = state.keywords || this.DEFAULT_KEYWORDS;
      kwContainer.innerHTML = currentKws.map(k => `
        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 shadow-2xs">
          <span>${k}</span>
          <button onclick="OutlookSyncManager.removeKeyword('${k}')" class="ml-1.5 text-blue-500 hover:text-red-600 font-black focus:outline-none" title="Quitar palabra">&times;</button>
        </span>
      `).join('') + `
        <button onclick="OutlookSyncManager.promptAddKeyword()" class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition">
          <i data-lucide="plus" class="w-3 h-3"></i>
          <span>Agregar Palabra</span>
        </button>
      `;
    }

    // Actualizar badge en la navegación
    if (badge) {
      badge.textContent = activeEmails.length;
      if (activeEmails.length > 0) {
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }

    if (!container) return;

    if (activeEmails.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    const catalog = MoonshineStore.getCatalog();
    const areasList = ['Línea SMT 01', 'Línea SMT 02', 'Backend / Ensamble', 'Calidad / Metrología', 'Almacén / Kitting', 'Mantenimiento', 'Ingeniería / NPI', 'Kaizen / Lean'];

    container.innerHTML = activeEmails.map(em => {
      const initials = (em.sender || 'MS')
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

      const currentPriority = em.selectedPriority || em.prioridadSugerida || 'Normal';

      // Detectar estructura seleccionada o sugerida
      let matchedStructId = em.selectedStructureId || catalog[0]?.id || 'EST-001';
      if (!em.selectedStructureId && em.sugerenciaEstructura) {
        const found = catalog.find(c => 
          c.name.toLowerCase().includes(em.sugerenciaEstructura.toLowerCase()) || 
          em.sugerenciaEstructura.toLowerCase().includes(c.name.toLowerCase())
        );
        if (found) matchedStructId = found.id;
      }

      const structOptionsHtml = catalog.map(c => 
        `<option value="${c.id}" ${c.id === matchedStructId ? 'selected' : ''}>${c.name}</option>`
      ).join('');

      const areaOptionsHtml = areasList.map(a => 
        `<option value="${a}" ${(em.areaSugerida && em.areaSugerida.includes(a)) ? 'selected' : ''}>${a}</option>`
      ).join('');

      const priorityButtonsHtml = [
        { key: 'Crítica', label: '🚨 Urgente', activeCls: 'bg-red-600 text-white border-red-600 shadow-sm font-black', inactiveCls: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 font-bold' },
        { key: 'Alta', label: '⚡ Alta', activeCls: 'bg-amber-600 text-white border-amber-600 shadow-sm font-black', inactiveCls: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 font-bold' },
        { key: 'Normal', label: '🔷 Media', activeCls: 'bg-blue-600 text-white border-blue-600 shadow-sm font-black', inactiveCls: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 font-bold' },
        { key: 'Baja', label: '⚪ Baja', activeCls: 'bg-slate-700 text-white border-slate-700 shadow-sm font-black', inactiveCls: 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 font-bold' }
      ].map(p => {
        const isSel = currentPriority === p.key;
        return `
          <button type="button" onclick="OutlookSyncManager.setCardPriority('${em.id}', '${p.key}')" 
                  class="flex-1 py-1.5 px-2 text-xs rounded-lg border transition ${isSel ? p.activeCls : p.inactiveCls}">
            ${p.label}
          </button>
        `;
      }).join('');

      return `
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 hover:border-blue-400 transition space-y-3" id="email-card-${em.id}">
          <div class="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div class="flex items-center space-x-2.5">
              <div class="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                ${initials}
              </div>
              <div>
                <h4 class="font-bold text-slate-900 text-sm">${em.sender || 'Solicitante'}</h4>
                <p class="text-[11px] text-slate-400">${em.receivedTime || 'Reciente'}</p>
              </div>
            </div>
          </div>

          <div>
            <h5 class="text-xs font-bold text-slate-800 mb-1">${em.subject || 'Solicitud'}</h5>
            <p class="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
              ${em.preview || em.body || ''}
            </p>
          </div>

          <!-- Controles Directos de Aprobación -->
          <div class="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2.5">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Prioridad</label>
              <div class="flex gap-1.5">
                ${priorityButtonsHtml}
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <div class="sm:col-span-2">
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Estructura</label>
                <select id="email-struct-${em.id}" onchange="OutlookSyncManager.setCardStructure('${em.id}', this.value)" class="w-full text-xs font-semibold p-2 border border-slate-300 rounded-lg bg-white outline-none">
                  ${structOptionsHtml}
                </select>
              </div>

              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tipo</label>
                <select id="email-tipo-${em.id}" class="w-full text-xs font-semibold p-2 border border-slate-300 rounded-lg bg-white outline-none">
                  <option value="Estructura Nueva" selected>🏗️ Nueva</option>
                  <option value="Arreglo / Modificación / Desarme">🔧 Arreglo</option>
                </select>
              </div>

              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Cant.</label>
                <input type="number" id="email-qty-${em.id}" min="1" max="100" value="${em.cantidad || 1}" class="w-full text-xs font-bold p-2 border border-slate-300 rounded-lg bg-white outline-none">
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Área</label>
              <select id="email-area-${em.id}" class="w-full text-xs font-semibold p-2 border border-slate-300 rounded-lg bg-white outline-none">
                ${areaOptionsHtml}
              </select>
            </div>
          </div>

          <div class="flex items-center justify-between gap-2 pt-1">
            <div class="flex items-center space-x-1">
              <button onclick="OutlookSyncManager.dismissEmail('${em.id}')" class="text-xs text-slate-500 hover:text-red-700 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition">
                Descartar
              </button>
              <button onclick="OutlookSyncManager.convertEmailToOrder('${em.id}')" class="text-xs text-slate-600 hover:text-slate-900 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition">
                Editar
              </button>
            </div>
            <button onclick="OutlookSyncManager.approveEmailOrder('${em.id}')" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition flex items-center space-x-1.5">
              <i data-lucide="check" class="w-4 h-4"></i>
              <span>Aprobar Pedido</span>
            </button>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) lucide.createIcons();
  }

  static setCardPriority(emailId, priority) {
    const state = this.getState();
    const email = (state.emails || []).find(e => e.id === emailId);
    if (email) {
      email.selectedPriority = priority;
      this.saveState(state);
      this.renderInbox();
    }
  }

  static setCardStructure(emailId, structId) {
    const state = this.getState();
    const email = (state.emails || []).find(e => e.id === emailId);
    if (email) {
      email.selectedStructureId = structId;
      this.saveState(state);
    }
  }

  static approveEmailOrder(emailId) {
    const state = this.getState();
    const email = (state.emails || []).find(e => e.id === emailId);
    if (!email) return;

    const structSelect = document.getElementById(`email-struct-${emailId}`);
    const qtyInput = document.getElementById(`email-qty-${emailId}`);
    const areaSelect = document.getElementById(`email-area-${emailId}`);
    const tipoSelect = document.getElementById(`email-tipo-${emailId}`);

    const selectedStructId = structSelect ? structSelect.value : (email.selectedStructureId || 'EST-001');
    const catalog = MoonshineStore.getCatalog();
    const structure = catalog.find(c => c.id === selectedStructId) || catalog[0];

    const cantidad = qtyInput ? (parseInt(qtyInput.value, 10) || 1) : (email.cantidad || 1);
    const area = areaSelect ? areaSelect.value : (email.areaSugerida || 'Línea SMT 01');
    const prioridad = email.selectedPriority || email.prioridadSugerida || 'Normal';
    const tipoTrabajo = tipoSelect ? tipoSelect.value : 'Estructura Nueva';

    const standardHours = structure.standardHours || 4.5;
    const horasEstimadas = parseFloat((standardHours * cantidad).toFixed(1));

    const orders = MoonshineStore.getOrders();
    const nextNum = (orders.length + 1).toString().padStart(3, '0');
    const newFolio = `MSH-2026-${nextNum}`;

    const newOrder = {
      id: newFolio,
      solicitante: email.sender || 'Solicitante Outlook',
      area: area,
      estructuraId: structure.id,
      estructuraNombre: structure.name,
      cantidad: cantidad,
      horasEstimadas: horasEstimadas,
      prioridad: prioridad,
      tipoTrabajo: tipoTrabajo,
      estado: 'Programado',
      fechaSolicitud: new Date().toISOString().split('T')[0],
      fechaRequerida: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      canalEntrada: 'Correo Outlook (Aprobado por Supervisor)',
      sketchupRef: structure.sketchupCode,
      notas: `Solicitud: "${email.subject || ''}". ${email.preview ? email.preview.slice(0, 150) : ''}`,
      progresoHoras: 0,
      turnoAsignado: null,
      diaAsignado: null,
      tecnicoAsignadoId: null,
      tecnicoAsignadoNombre: null
    };

    orders.unshift(newOrder);
    MoonshineStore.saveOrders(orders);

    // Archivar de la bandeja
    if (!state.dismissedIds.includes(emailId)) {
      state.dismissedIds.push(emailId);
    }
    this.saveState(state);

    // Re-secuenciar el plan maestro multi-semana
    SchedulingEngine.runAutoSchedule();

    const updatedOrders = MoonshineStore.getOrders();
    const scheduled = updatedOrders.find(o => o.id === newFolio) || newOrder;

    showToast(`✅ Pedido ${newFolio} aprobado con prioridad ${prioridad}. Entrega: ${scheduled.fechaCompromisoTexto || scheduled.fechaCompromisoEntrega || 'En cola'}.`, 'success');

    // Mostrar modal con correo formal listo para copiar a Outlook
    this.showApprovalConfirmationModal(scheduled);

    this.renderInbox();
    this.updateNotificationBanner();
    if (typeof renderWeeklyGrid === 'function') renderWeeklyGrid();
    if (typeof renderDeliveryStatusPlan === 'function') renderDeliveryStatusPlan();
    if (typeof updateKPIs === 'function') updateKPIs();
    if (typeof renderOrdersTable === 'function') renderOrdersTable();
    if (typeof renderTallerFloor === 'function') renderTallerFloor();
    if (typeof renderTechniciansEfficiency === 'function') renderTechniciansEfficiency();
  }

  static showApprovalConfirmationModal(order) {
    const modalId = 'modalApprovalConfirmation';
    let modal = document.getElementById(modalId);
    if (!modal) {
      modal = document.createElement('div');
      modal.id = modalId;
      modal.className = 'fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all';
      document.body.appendChild(modal);
    }

    const deliveryDateStr = EmailReportGenerator.formatDeliveryDateWithBuffer(order);

    const emailBody = `Hola ${order.solicitante},

Tu solicitud de estructura Moonshine ha sido aprobada y ya se encuentra programada en nuestro Plan de Entregas:

📌 Folio Oficial: ${order.id}
👤 Pedido de: ${order.solicitante} (${order.area})
🏗️ Estructura Solicitada: ${order.estructuraNombre} (${order.cantidad} pieza${order.cantidad > 1 ? 's' : ''})
🔧 Tipo de Trabajo: ${order.tipoTrabajo || 'Estructura Nueva'}
🚨 Prioridad Asignada: ${order.prioridad}

📅 FECHA COMPROMISO DE ENTREGA:
🚚 Se entregará el día: ${deliveryDateStr}

Puedes consultar en vivo el estatus de tu pedido y el plan de entregas en nuestro portal:
https://gemaromoflex.github.io/moonshineplanner/?vista=entregas

Atentamente,
Equipo Moonshine Axiom`;

    modal.innerHTML = `
      <div class="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-scale-in">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div class="flex items-center space-x-2.5">
            <div class="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <i data-lucide="check-circle" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="font-black text-slate-900 text-base">¡Pedido Aprobado e Incorporado al Plan!</h3>
              <p class="text-xs text-slate-500">Respuesta formal lista para enviar al solicitante por Outlook</p>
            </div>
          </div>
          <button onclick="document.getElementById('${modalId}').classList.add('hidden')" class="text-slate-400 hover:text-slate-600 font-bold text-lg">&times;</button>
        </div>

        <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs font-mono space-y-2 mb-4 max-h-60 overflow-y-auto">
          <p class="text-slate-500 font-sans font-bold text-[11px]">Vista Previa del Correo de Compromiso:</p>
          <pre class="whitespace-pre-wrap font-sans text-xs text-slate-800 leading-relaxed">${emailBody}</pre>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <button onclick="OutlookSyncManager.copyTextToClipboard(\`${emailBody.replace(/`/g, '\\`')}\`); document.getElementById('${modalId}').classList.add('hidden');" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow transition">
            <i data-lucide="copy" class="w-4 h-4"></i>
            <span>Copiar Correo Formal</span>
          </button>
          <button onclick="document.getElementById('${modalId}').classList.add('hidden')" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition">
            <span>Cerrar</span>
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  }

  static copyTextToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('📋 Correo formal copiado al portapapeles. ¡Listo para pegar en Outlook!', 'success');
      });
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('📋 Correo formal copiado al portapapeles.', 'success');
    }
  }

  static parsePastedEmail(rawText) {
    if (!rawText || !rawText.trim()) {
      showToast('Por favor pega el contenido del correo o mensaje.', 'warning');
      return;
    }
    const text = rawText.trim();
    const state = this.getState();

    // 1. Detectar Solicitante
    let sender = 'Ingeniero de Planta';
    let senderEmail = 'solicitud.moonshine@axiom.com';
    const fromMatch = text.match(/(?:De|From):\s*([^<\r\n]+)(?:<([^>\r\n]+)>)?/i);
    if (fromMatch) {
      sender = fromMatch[1].trim();
      if (fromMatch[2]) senderEmail = fromMatch[2].trim();
    } else {
      const firstLine = text.split('\n')[0].replace(/^Hola,?|^Buenos días,?|^Estimados,?/i, '').trim();
      if (firstLine.length > 3 && firstLine.length < 50) {
        sender = firstLine;
      }
    }

    // 2. Detectar Asunto
    let subject = 'Solicitud de Estructuras Moonshine';
    const subjMatch = text.match(/(?:Asunto|Subject):\s*([^\r\n]+)/i);
    if (subjMatch) {
      subject = subjMatch[1].trim();
    }

    // 3. Palabras clave coincidentes
    const currentKws = state.keywords || this.DEFAULT_KEYWORDS;
    const matchedWords = [];
    currentKws.forEach(k => {
      const regex = new RegExp(`\\b${k}\\b`, 'i');
      if (regex.test(text)) matchedWords.push(k);
    });

    // 4. Estructura sugerida del catálogo
    const catalog = MoonshineStore.getCatalog();
    let suggestedStruct = catalog[0];
    for (const c of catalog) {
      if (text.toLowerCase().includes(c.name.toLowerCase())) {
        suggestedStruct = c;
        break;
      }
    }
    if (suggestedStruct.id === catalog[0].id) {
      if (/rack/i.test(text)) {
        const f = catalog.find(c => c.name.toLowerCase().includes('rack'));
        if (f) suggestedStruct = f;
      } else if (/mesa|estaci[oó]n/i.test(text)) {
        const f = catalog.find(c => c.name.toLowerCase().includes('table') || c.name.toLowerCase().includes('mesa'));
        if (f) suggestedStruct = f;
      } else if (/car|carrito/i.test(text)) {
        const f = catalog.find(c => c.name.toLowerCase().includes('car'));
        if (f) suggestedStruct = f;
      }
    }

    // 5. Cantidad
    let cantidad = 1;
    const qtyMatch = text.match(/(\d+)\s*(?:piezas?|pzas?|estructuras?|mesas?|carritos?|racks?)/i);
    if (qtyMatch) {
      cantidad = parseInt(qtyMatch[1], 10) || 1;
    }

    // 6. Área
    let areaSugerida = 'Línea SMT 01';
    if (/SMT\s*0?2/i.test(text)) areaSugerida = 'Línea SMT 02';
    else if (/SMT/i.test(text)) areaSugerida = 'Línea SMT 01';
    else if (/backend|ensamble/i.test(text)) areaSugerida = 'Backend / Ensamble';
    else if (/calidad|qa/i.test(text)) areaSugerida = 'Calidad / Metrología';
    else if (/almacen|almacén|kitting/i.test(text)) areaSugerida = 'Almacén / Kitting';
    else if (/npi|ingenieria|ingeniería/i.test(text)) areaSugerida = 'Ingeniería / NPI';
    else if (/kaizen/i.test(text)) areaSugerida = 'Kaizen / Lean';

    // 7. Prioridad sugerida
    let prioridadSugerida = 'Normal';
    if (/urgente|paro|crítico|critica|emergencia|asap|inmediat/i.test(text)) {
      prioridadSugerida = 'Crítica';
    } else if (/alta|prioritari|pronto/i.test(text)) {
      prioridadSugerida = 'Alta';
    }

    const newEmail = {
      id: 'REQ-' + Date.now(),
      sender,
      senderEmail,
      subject,
      receivedTime: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      preview: text.length > 220 ? text.substring(0, 220) + '...' : text,
      body: text,
      importance: prioridadSugerida,
      sugerenciaEstructura: suggestedStruct.name,
      selectedStructureId: suggestedStruct.id,
      prioridadSugerida: prioridadSugerida,
      selectedPriority: prioridadSugerida,
      areaSugerida,
      cantidad,
      palabrasDetectadas: matchedWords.length > 0 ? matchedWords.join(', ') : 'Moonshine'
    };

    if (!Array.isArray(state.emails)) state.emails = [];
    state.emails.unshift(newEmail);
    this.saveState(state);
    this.renderInbox();
    this.updateNotificationBanner();
    showToast('✅ Solicitud agregada a la bandeja. El supervisor puede revisarla y aprobarla.', 'success');
  }

  static updateNotificationBanner() {
    const banner = document.getElementById('inboxNotificationBanner');
    const textEl = document.getElementById('inboxBannerText');
    if (!banner) return;

    const state = this.getState();
    const activeEmails = (state.emails || []).filter(e => !state.dismissedIds.includes(e.id));

    if (activeEmails.length > 0) {
      banner.classList.remove('hidden');
      if (textEl) {
        textEl.textContent = `Tienes ${activeEmails.length} solicitud(es) de Moonshine pendientes en Outlook.`;
      }
    } else {
      banner.classList.add('hidden');
    }
  }

  static convertEmailToOrder(emailId) {
    const state = this.getState();
    const email = (state.emails || []).find(e => e.id === emailId);
    if (!email) return;

    // Cambiar a la pestaña de Nuevo Pedido
    switchTab('tab-solicitud');

    // Prellenar Solicitante
    const inputSolicitante = document.getElementById('inputSolicitante');
    if (inputSolicitante) inputSolicitante.value = email.sender || '';

    // Prellenar Área si fue detectada
    if (email.areaSugerida) {
      const inputArea = document.getElementById('inputArea');
      if (inputArea) {
        for (let i = 0; i < inputArea.options.length; i++) {
          if (inputArea.options[i].value === email.areaSugerida) {
            inputArea.selectedIndex = i;
            break;
          }
        }
      }
    }

    // Prellenar Estructura si coincide con el catálogo
    if (email.sugerenciaEstructura) {
      const select = document.getElementById('inputEstructura');
      if (select) {
        for (let i = 0; i < select.options.length; i++) {
          if (select.options[i].text.includes(email.sugerenciaEstructura)) {
            select.selectedIndex = i;
            onSelectStructureChange();
            break;
          }
        }
      }
    }

    // Prellenar Prioridad
    if (email.prioridadSugerida) {
      const radios = document.getElementsByName('prioridad');
      for (const r of radios) {
        if (r.value === email.prioridadSugerida) {
          r.checked = true;
          highlightPriority(r);
          break;
        }
      }
    }

    // Canal de Entrada a Correo Outlook
    const inputCanal = document.getElementById('inputCanalEntrada');
    if (inputCanal) inputCanal.value = 'Correo Outlook';

    // Notas con Asunto y fragmento
    const inputNotas = document.getElementById('inputNotas');
    if (inputNotas) {
      inputNotas.value = `[Outlook] ${email.subject} — ${(email.preview || '').substring(0, 120)}`;
    }

    // Resaltado visual en el campo Solicitante
    if (inputSolicitante) {
      inputSolicitante.focus();
      inputSolicitante.classList.add('ring-4', 'ring-blue-300');
      setTimeout(() => inputSolicitante.classList.remove('ring-4', 'ring-blue-300'), 1500);
    }

    showToast(`Solicitud de ${email.sender} cargada en el formulario. Revisa y haz clic en Guardar.`, 'success');
  }

  static dismissEmail(emailId) {
    const state = this.getState();
    if (!state.dismissedIds.includes(emailId)) {
      state.dismissedIds.push(emailId);
    }
    this.saveState(state);
    this.renderInbox();
    this.updateNotificationBanner();
    showToast('Solicitud archivada / atendida.', 'info');
  }

  static openOutlookApp() {
    fetch('/api/open-outlook').catch(() => {});
    window.location.href = 'mailto:?subject=Moonshine';
    showToast('Abriendo Microsoft Outlook...', 'info');
  }

  static copyBossLink() {
    const state = this.getState();
    const url = state.networkInfo.networkUrl || window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      showToast(`Enlace copiado: ${url}`, 'success');
    }).catch(() => {
      prompt('Copia este enlace para tu jefe:', url);
    });
  }

  static promptAddKeyword() {
    const word = prompt('Ingresa una nueva palabra o término a buscar en Outlook:');
    if (word) this.addKeyword(word);
  }

  static addKeyword(word) {
    const trimmed = (word || '').trim();
    if (!trimmed) return;
    const state = this.getState();
    if (!state.keywords) state.keywords = [...this.DEFAULT_KEYWORDS];
    if (!state.keywords.some(k => k.toLowerCase() === trimmed.toLowerCase())) {
      state.keywords.push(trimmed);
      this.saveState(state);
      this.renderInbox();
      this.scanNow(false);
      showToast(`Palabra clave "${trimmed}" agregada al escáner.`, 'success');
    } else {
      showToast(`La palabra "${trimmed}" ya está en la lista de búsqueda.`, 'info');
    }
  }

  static removeKeyword(word) {
    const state = this.getState();
    if (!state.keywords) return;
    state.keywords = state.keywords.filter(k => k.toLowerCase() !== word.toLowerCase());
    if (state.keywords.length === 0) {
      state.keywords = ['Moonshine'];
    }
    this.saveState(state);
    this.renderInbox();
    showToast(`Palabra "${word}" removida de la búsqueda.`, 'info');
  }

  static resetKeywords() {
    const state = this.getState();
    state.keywords = [...this.DEFAULT_KEYWORDS];
    this.saveState(state);
    this.renderInbox();
    this.scanNow(false);
    showToast('Palabras clave restauradas a las predeterminadas.', 'info');
  }

  static loadSampleEmail() {
    const state = this.getState();
    const sampleId = 'SAMPLE-' + Date.now();
    const sample = {
      id: sampleId,
      sender: 'Ing. Carlos Mendoza (Línea SMT 02)',
      senderEmail: 'carlos.mendoza@axiom.com',
      subject: 'URGENTE: Solicitud de 2 mesas de ensamble ergonómicas y racks con perfil tubular',
      receivedTime: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      preview: 'Hola equipo Moonshine, requerimos urgente 2 mesas de ensamble ergonómicas y 1 rack dinámico con perfil tubular para la línea SMT 02 debido a arranque de nuevo modelo este jueves. Favor de confirmar tiempo de entrega.',
      body: 'Hola equipo Moonshine, requerimos urgente 2 mesas de ensamble ergonómicas y 1 rack dinámico con perfil tubular para la línea SMT 02 debido a arranque de nuevo modelo este jueves. Favor de confirmar tiempo de entrega.',
      importance: 'Alta',
      sugerenciaEstructura: 'Estación de Trabajo / Mesa de Ensamble Ergonómica',
      prioridadSugerida: 'Crítica',
      areaSugerida: 'Línea SMT 02',
      palabrasDetectadas: 'mesas, racks, perfil'
    };

    state.emails.unshift(sample);
    this.saveState(state);
    this.renderInbox();
    this.updateNotificationBanner();
    showToast('Correo de prueba con palabras clave cargado en la bandeja.', 'success');
  }

  static setAutoScanEnabled(enabled) {
    const state = this.getState();
    state.autoScanEnabled = enabled;
    this.saveState(state);
    this.setupTimer();
    showToast(enabled ? 'Auto-escaneo periódico activado.' : 'Auto-escaneo en pausa.', 'info');
  }

  static setIntervalMinutes(mins) {
    const state = this.getState();
    state.intervalMinutes = parseInt(mins, 10) || 5;
    this.saveState(state);
    this.setupTimer();
    showToast(`Intervalo actualizado a cada ${state.intervalMinutes} minutos.`, 'info');
  }
}

// ==========================================
// 7. SINCRONIZACIÓN EN TIEMPO REAL CON SUPABASE
// ==========================================
class SupabaseCloudSync {
  static SUPABASE_URL = 'https://rutlzcimpvxjuimxpcxx.supabase.co';
  static SUPABASE_KEY = 'sb_publishable_8xnIFofq-cj8j9GwqcLZ0A_CX1InWlU';
  static TABLE = 'moonshine_store';
  static lastTimestamps = {};
  static syncInterval = null;
  static isReady = false;

  static getHeaders(extra = {}) {
    return {
      'apikey': this.SUPABASE_KEY,
      'Content-Type': 'application/json',
      ...extra
    };
  }

  static async init() {
    await this.pullAll(true);
    // Sincronización periódica cada 8 segundos para reflejar cambios en vivo entre jefe, supervisores y técnicos
    if (this.syncInterval) clearInterval(this.syncInterval);
    this.syncInterval = setInterval(() => this.pullAll(false), 8000);
    window.addEventListener('focus', () => this.pullAll(false));
  }

  static async pushKey(key, value) {
    try {
      const nowIso = new Date().toISOString();
      this.lastTimestamps[key] = nowIso;
      const res = await fetch(`${this.SUPABASE_URL}/rest/v1/${this.TABLE}?on_conflict=store_key`, {
        method: 'POST',
        headers: this.getHeaders({ 'Prefer': 'resolution=merge-duplicates,return=minimal' }),
        body: JSON.stringify([{ store_key: key, store_data: value, updated_at: nowIso }])
      });
      if (res.ok) {
        this.isReady = true;
      }
    } catch (e) {
      // Silencioso en modo offline
    }
  }

  static async pullAll(isInitial = false) {
    try {
      const res = await fetch(`${this.SUPABASE_URL}/rest/v1/${this.TABLE}?select=store_key,store_data,updated_at`, {
        method: 'GET',
        headers: this.getHeaders(),
        cache: 'no-store'
      });

      if (!res.ok) return;
      const rows = await res.json();
      if (!Array.isArray(rows)) return;
      this.isReady = true;

      // Si la tabla en Supabase está recién creada (vacía), subimos los datos iniciales
      if (rows.length === 0 && isInitial) {
        await this.pushKey(STORAGE_KEYS.ORDERS, MoonshineStore.getOrders());
        await this.pushKey(STORAGE_KEYS.CATALOG, MoonshineStore.getCatalog());
        await this.pushKey(STORAGE_KEYS.TECHNICIANS, MoonshineStore.getTechnicians());
        await this.pushKey(STORAGE_KEYS.ROSTER_SCHEDULE, MoonshineStore.getRosterSchedule());
        await this.pushKey(STORAGE_KEYS.OVERTIME, MoonshineStore.getOvertime());
        await this.pushKey(STORAGE_KEYS.SETTINGS, MoonshineStore.getSettings());
        await this.pushKey(OutlookSyncManager.STORAGE_KEY, OutlookSyncManager.getState());
        return;
      }

      let anyChanged = false;
      rows.forEach(row => {
        if (!row || !row.store_key || row.store_data === undefined) return;
        const prevTs = this.lastTimestamps[row.store_key];
        const currentLocalStr = localStorage.getItem(row.store_key);
        const incomingStr = JSON.stringify(row.store_data);

        if (currentLocalStr !== incomingStr && (!prevTs || row.updated_at > prevTs)) {
          localStorage.setItem(row.store_key, incomingStr);
          this.lastTimestamps[row.store_key] = row.updated_at;
          anyChanged = true;
        } else if (!prevTs && row.updated_at) {
          this.lastTimestamps[row.store_key] = row.updated_at;
        }
      });

      if (anyChanged) {
        SchedulingEngine.runAutoSchedule();
        if (typeof renderOrdersTable === 'function') renderOrdersTable();
        if (typeof renderDeliveryStatusPlan === 'function') renderDeliveryStatusPlan();
        if (typeof renderWeeklyGrid === 'function') renderWeeklyGrid();
        if (typeof renderTallerFloor === 'function') renderTallerFloor();
        if (typeof renderTechniciansEfficiency === 'function') renderTechniciansEfficiency();
        if (typeof renderTechniciansManagement === 'function') renderTechniciansManagement();
        if (typeof renderRosterCalendar === 'function') renderRosterCalendar();
        if (typeof renderCatalogGrid === 'function') renderCatalogGrid();
        if (typeof renderStructureSelect === 'function') renderStructureSelect();
        if (typeof updateKPIs === 'function') updateKPIs();
        if (typeof updateEmailPreview === 'function') updateEmailPreview();
        OutlookSyncManager.renderInbox();
        OutlookSyncManager.updateNotificationBanner();
      }
    } catch (e) {
      // Silencioso si no hay red
    }
  }
}

// Iniciar sincronización con Supabase al cargar
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => SupabaseCloudSync.init(), 500);
});

// Exportar globalmente para index.html
window.MoonshineStore = MoonshineStore;
window.SchedulingEngine = SchedulingEngine;
window.EmailReportGenerator = EmailReportGenerator;
window.SharePointBridge = SharePointBridge;
window.OutlookSyncManager = OutlookSyncManager;
window.SupabaseCloudSync = SupabaseCloudSync;
window.DAYS_OF_WEEK = DAYS_OF_WEEK;
window.SHIFTS_DEF = SHIFTS_DEF;
