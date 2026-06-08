<div align="center">

# 🛰️ DisasterEye

### Detecção e prevenção de desastres naturais em tempo real através de satélites

**Conectando a indústria espacial à vida cotidiana — transformando imagens orbitais em alertas que protegem pessoas e ecossistemas.**

![React Native](https://img.shields.io/badge/React_Native-0.83-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo_SDK-55-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Status](https://img.shields.io/badge/Status-Funcional-3DDC97?style=for-the-badge)

*Global Solution 2026 · FIAP*

</div>

---

## 📑 Sumário

- [Sobre o Projeto](#-sobre-o-projeto)
- [Impacto Social — ODS da ONU](#-impacto-social--ods-da-onu)
- [Funcionalidades](#-funcionalidades)
- [Diferenciais de Inovação](#-diferenciais-de-inovação)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [APIs Utilizadas](#-apis-utilizadas)
- [Como Executar](#️-como-executar)
- [Conexão com o Back-End](#-conexão-com-o-back-end-java)
- [Capturas de Tela](#-capturas-de-tela)
- [Integrantes](#-integrantes)

---

## 🌎 Sobre o Projeto

O **DisasterEye** é um aplicativo mobile que monitora, alerta e prevê **desastres naturais** — queimadas, enchentes, tempestades e secas — utilizando dados de **sensoriamento remoto** processados por satélites da **NASA** (MODIS, VIIRS, SMAP, GRACE-FO, GOES-16) e do **INPE** (Programa Queimadas).

Satélites observam a Terra continuamente, gerando dados orbitais sobre anomalias térmicas, lâmina d'água por radar e índices de vegetação. Uma **API Java** processa esses dados brutos e os disponibiliza ao app como **alertas geolocalizados**, transformando informação espacial em ação preventiva.

A proposta vai além do simples alerta: o app evolui de **reativo** para **preditivo**, calculando onde o próximo desastre tem maior probabilidade de acontecer e para onde a fumaça das queimadas será transportada pelos ventos — conectando o espaço diretamente à **saúde pública** e à **resposta de emergência**.

### 🛰️ Relação com a Indústria Espacial

- **Satélites & Monitoramento Orbital** — origem de todos os dados
- **Sensoriamento Remoto** — detecção de anomalias térmicas, hídricas e atmosféricas
- **Análise Climática** — correlação entre eventos meteorológicos e desastres
- **Comunicação Global** — alertas geolocalizados em qualquer região do planeta
- **Sustentabilidade** — resposta rápida reduz impacto ambiental e protege biomas
- **Infraestrutura Espacial** — uso de constelações VIIRS, MODIS, GOES e radar Sentinel

---

## 🌱 Impacto Social — ODS da ONU

O DisasterEye está alinhado a **três Objetivos de Desenvolvimento Sustentável** definidos pela ONU para a Agenda 2030:

### 🏗️ ODS 9 — Indústria, Inovação e Infraestrutura

> *"Construir infraestrutura resiliente, promover industrialização sustentável e fomentar a inovação."*

O DisasterEye é uma **inovação tecnológica** que aproveita a **infraestrutura espacial** existente (satélites NASA e INPE) para gerar valor social. A arquitetura do projeto — back-end Java processando dados orbitais e front-end mobile multiplataforma — demonstra como infraestrutura digital moderna pode transformar dados científicos em ferramentas acessíveis a qualquer cidadão.

### 🏙️ ODS 11 — Cidades e Comunidades Sustentáveis

> *"Reduzir significativamente o número de mortes e o número de pessoas afetadas por catástrofes."*

Este é o alinhamento mais direto da nossa solução. O app **protege cidades e comunidades** alertando sobre desastres antes ou durante sua ocorrência. A funcionalidade de **Rota da Fumaça** avisa cidades distantes que terão a qualidade do ar afetada por queimadas — exatamente o tipo de informação que torna comunidades mais **resilientes** a eventos extremos.

### 🌡️ ODS 13 — Ação Contra a Mudança Global do Clima

> *"Reforçar a resiliência e a capacidade de adaptação a riscos climáticos e desastres naturais."*

Queimadas, enchentes, secas e tempestades estão **diretamente ligadas às mudanças climáticas** — são seus principais sintomas. O DisasterEye fortalece a **resposta e adaptação** a esses eventos. Detecção precoce de focos de incêndio em biomas como Amazônia, Cerrado e Pantanal ajuda a **reduzir a destruição ambiental** e proteger ecossistemas críticos para o equilíbrio climático global.

---

## ✨ Funcionalidades

| Tela | Recursos Principais |
|------|---------------------|
| 🏠 **Home** | Dashboard com indicadores em tempo real · gráfico animado de distribuição por tipo · badge "AO VIVO" pulsante · card preditivo de risco crítico · alertas recentes · pull-to-refresh |
| 🛰️ **Alertas** | Listagem completa · **busca** por cidade/estado · **filtros por tipo** (queimada, enchente, tempestade, seca) · **ordenação** (recentes, gravidade, área afetada) · empty states |
| 🔮 **Previsão** | **Dois modos preditivos**: Risco de Ignição (NASA SMAP/GRACE-FO) com Índice de Vulnerabilidade Espacial 0-100 · Rota da Fumaça (NASA MODIS) com bússola de vento e timeline de cidades impactadas |
| 🌍 **Globo em Chamas** | Mapa-múndi com focos ativos globais da NASA FIRMS · pontos pulsantes por nível de confiança · ranking de regiões mais afetadas |
| 📄 **Detalhe** | Relatório técnico operacional · sensor e algoritmo inferidos · barra de confiança · clima correlacionado (OpenWeather) · rota da fumaça (em queimadas) |
| ⭐ **Salvos** | Favoritos persistidos localmente · histórico das 15 últimas visualizações · limpar histórico |
| ⚙️ **Config** | Dark/Light mode persistido · estatísticas de uso · links para fontes oficiais (INPE, NASA) |

---

## 🚀 Diferenciais de Inovação

### 🔮 Índice de Vulnerabilidade Espacial
Combina umidade do solo (NASA SMAP), temperatura, vento e estresse da vegetação em uma pontuação **0-100** com janela de tempo de risco. Transforma o app de **reativo** em **preditivo**, gerando recomendações automáticas para brigadas e autoridades.

### 💨 Rota da Fumaça
Usa dados do MODIS sobre aerossóis e direção dos ventos para alertar **cidades distantes** que serão afetadas pela fumaça de uma queimada. Mostra **ETA por cidade**, impacto previsto na qualidade do ar (PM2.5) e visualização com bússola de direção do vento.

### 🌍 Globo em Chamas
Mapa-múndi interativo com **todos os focos ativos** detectados nas últimas 24h pelos satélites VIIRS e MODIS via NASA FIRMS. Pontos pulsantes com halo expansivo, ranking global de regiões mais afetadas.

### 📡 Relatório Técnico Operacional
Cada alerta exibe sensor responsável (MODIS banda 21, Sentinel-1 SAR, GOES-16 ABI, NDVI), algoritmo aplicado (BRIGHTNESS_T4, σ⁰ pré/pós, Convective Initiation) e confiança visual da detecção — estética de **centro de monitoramento orbital**.

---

## 🧠 Tecnologias

### Mobile
- **React Native** 0.83
- **Expo SDK** 55
- **TypeScript** 5.9 (tipagem forte, interfaces, generics)

### Navegação
- **React Navigation** v7 — Bottom Tabs + Native Stack
- Navegação **tipada** com `RootStackParamList` e `TabParamList`

### Estado Global
- **Context API** — `ThemeContext` e `AlertsContext`
- **Custom Hooks** — `useFilteredAlerts`, `useDashboardStats`

### Persistência
- **AsyncStorage** — favoritos, histórico, preferência de tema

### Consumo de API
- **Axios** com **interceptors** (request + response)
- **Service Layer** com tratamento de erro centralizado
- **Fallback automático** para dados simulados em caso de falha

### UI/UX
- Design System próprio · Componentização · Dark Mode · Responsividade · Animações suaves · Skeleton loading · Microinterações

---

## 🧱 Arquitetura

### Visão Geral

```
┌─────────────────────────────────────────────────────────────┐
│  CAMADA 1 — FONTES DE DADOS ORBITAIS                        │
│  NASA (MODIS, VIIRS, SMAP, GRACE-FO, GOES-16, FIRMS)        │
│  INPE (Programa Queimadas) · OpenWeather                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  CAMADA 2 — API JAVA (back-end do grupo)                    │
│  Processa dados brutos · expõe endpoints REST /api/v1/*     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  CAMADA 3 — APLICATIVO MOBILE (React Native + TypeScript)   │
│  Service Layer → Context API → Telas → AsyncStorage         │
└─────────────────────────────────────────────────────────────┘
```

### Estrutura de Pastas

```
src/
 ├── components/        # 12+ componentes reutilizáveis
 │   ├── AlertCard.tsx
 │   ├── SeverityBadge.tsx
 │   ├── RiskGauge.tsx
 │   ├── SmokeRouteCard.tsx
 │   ├── SatelliteReportCard.tsx
 │   ├── WorldMapView.tsx
 │   ├── DistributionChart.tsx
 │   ├── LiveBadge.tsx
 │   └── ...
 ├── screens/           # 7 telas funcionais
 │   ├── HomeScreen.tsx
 │   ├── AlertsListScreen.tsx
 │   ├── AlertDetailScreen.tsx
 │   ├── ForecastScreen.tsx
 │   ├── GlobalFiresScreen.tsx
 │   ├── FavoritesScreen.tsx
 │   └── SettingsScreen.tsx
 ├── navigation/        # RootNavigator (Tabs + Stack tipados)
 ├── services/          # Service Layer: api.ts (Axios) + mockData.ts
 ├── hooks/             # Custom hooks
 ├── contexts/          # ThemeContext, AlertsContext
 ├── storage/           # Persistência AsyncStorage
 ├── types/             # Tipagem central
 ├── theme/             # Design System
 ├── utils/             # Formatação (datas, área, tempo relativo)
 └── assets/            # Imagens e ícones
```

### Princípios Arquiteturais

- **Separação de responsabilidades** — cada pasta tem propósito único
- **Tipagem forte end-to-end** — contratos claros entre todas as camadas
- **Resiliência por design** — fallback automático garante app sempre funcional
- **Reusabilidade** — componentes e hooks genéricos
- **Multiplataforma** — mesmo código roda em Android, iOS e Web sem ajustes

---

## 🌍 APIs Utilizadas

| API | Uso |
|-----|-----|
| **API DisasterEye (Java)** | Back-end do grupo — processa dados INPE/NASA *(URL configurável em `src/services/api.ts`)* |
| **OpenWeather** | Condição meteorológica por coordenada — https://openweathermap.org/api |
| **NASA FIRMS** | Focos ativos globais em tempo real (VIIRS/MODIS) — https://firms.modaps.eosdis.nasa.gov/api |
| **NASA SMAP** | Umidade do solo para previsão de risco de ignição |
| **NASA GRACE-FO** | Déficit hídrico em escala continental |
| **NASA MODIS** | Aerossóis e transporte de fumaça (Terra/Aqua) |
| **INPE Queimadas** | Programa brasileiro de monitoramento — https://terrabrasilis.dpi.inpe.br/queimadas/portal/ |

> 💡 **Modo offline**: sem o back-end disponível, o app funciona com **dados simulados realistas** baseados em regiões críticas reais (Amazônia, Pantanal, Cerrado, Sertão, etc.) graças ao fallback automático na camada de serviços.

---

## ▶️ Como Executar

### Pré-requisitos
- **Node.js** 18 ou superior
- **npm** (vem com o Node)
- **Expo Go** instalado no celular (Android/iOS) *— opcional para testar no dispositivo*

### Passos

```bash
# 1. Instale as dependências
npm install

# 2. Inicie o projeto
npm start
```

No terminal do Expo, escolha a plataforma:

```bash
# Android (Expo Go ou emulador)
npm run android

# iOS (Expo Go ou simulador — apenas macOS)
npm run ios

# Web (abre no navegador)
npm run web
```

Você também pode escanear o **QR Code** com o Expo Go no celular para abrir o app diretamente.

### ✅ Executa em
- ✅ **Android** (Expo Go ou emulador)
- ✅ **iOS** (Expo Go ou simulador)
- ✅ **Web** (qualquer navegador moderno)

---

## 🔌 Conexão com o Back-End Java

O app consome dados do back-end Java do grupo via REST. Para conectar à API:

### 1. Configurar a URL base

Abra `src/services/api.ts` e atualize a constante `API_BASE_URL`:

```typescript
// Para back-end rodando localmente no mesmo PC do Expo:
const API_BASE_URL = 'http://localhost:8080/api';

// Para back-end em outro PC da mesma rede Wi-Fi:
const API_BASE_URL = 'http://192.168.X.X:8080/api';

// Para back-end hospedado:
const API_BASE_URL = 'https://disastereye-api.exemplo.com/api';
```

> 🔍 **Como descobrir o IP do PC**: no Windows, abra o PowerShell e rode `ipconfig`. Procure "Endereço IPv4" do adaptador Wi-Fi.

### 2. Liberar HTTP no Android

Para conexões `http://` (sem TLS), edite `app.json` adicionando:

```json
"android": {
  "config": {
    "usesCleartextTraffic": true
  }
}
```

Em seguida, reinicie o Expo com `npx expo start --clear`.

### 3. Endpoints esperados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/v1/alerts` | Lista de alertas de desastres |
| `GET` | `/v1/alerts/{id}` | Detalhe de um alerta específico |
| `GET` | `/v1/forecast/fire-risk` | Previsões de risco de ignição |
| `GET` | `/v1/forecast/smoke-plumes` | Rotas de fumaça ativas |
| `GET` | `/v1/forecast/smoke-plumes/by-alert/{id}` | Rota de fumaça de um alerta |

> 📘 **Documentação interativa**: o back-end Java expõe o **Swagger UI** em `http://localhost:8080/swagger-ui.html` para explorar e testar todos os endpoints.

### 4. Mesma rede Wi-Fi

Para testar no celular físico, **PC e celular precisam estar na mesma rede Wi-Fi**. Caso contrário, use o emulador Android ou rode no navegador via `npm run web`.

---

## 📸 Capturas de Tela

> *Adicione capturas de tela do app rodando em uma pasta `docs/` na raiz do projeto.*

<div align="center">

| Home | Alertas | Previsão |
|:---:|:---:|:---:|
| ![Home](docs/home.png) | ![Alertas](docs/alerts.png) | ![Previsão](docs/forecast.png) |

| Detalhe | Globo em Chamas | Salvos |
|:---:|:---:|:---:|
| ![Detalhe](docs/detail.png) | ![Globo](docs/globe.png) | ![Salvos](docs/saved.png) |

</div>

---

## 👥 Integrantes

| Nome | RM |
|------|-----|
| _Preencher_ | RM_____ |
| _Preencher_ | RM_____ |
| _Preencher_ | RM_____ |
| _Preencher_ | RM_____ |
| _Preencher_ | RM_____ |

---

## 📦 Entrega

- ✅ Código-fonte completo no repositório GitHub
- ✅ Sem `node_modules/` no repositório
- ✅ README preenchido com instruções, capturas e integrantes
- ✅ Aplicação funcional em Android, iOS e Web
- ✅ Demonstração dos conceitos trabalhados em aula

---

<div align="center">

### 🛰️ DisasterEye

*Transformando imagens orbitais em alertas que protegem pessoas e ecossistemas.*

**Global Solution 2026 · FIAP**

</div>
