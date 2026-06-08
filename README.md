# 🛰️ DisasterEye

**Detecção de desastres naturais em tempo real a partir de imagens de satélite.**

DisasterEye é um aplicativo mobile que conecta a **indústria espacial à vida cotidiana**: ele consome dados orbitais processados (INPE e NASA) para detectar **enchentes, queimadas, tempestades e secas**, transformando imagens de satélite em **alertas geolocalizados** que ajudam a salvar vidas.

> Projeto desenvolvido para a **Global Solution** — React Native + Expo SDK 55 + TypeScript.

---

## 🌎 Sobre o projeto

Satélites observam a Terra continuamente, gerando dados de sensoriamento remoto (anomalias térmicas, lâmina d'água por radar, índices de vegetação). Uma **API Java** processa esses dados das fontes **INPE** (Programa Queimadas) e **NASA** (Open APIs / GOES / MODIS) e os disponibiliza ao app como alertas estruturados.

O DisasterEye apresenta esses alertas em uma interface moderna de "centro de monitoramento orbital", permitindo acompanhar eventos em tempo real, filtrá-los, salvá-los e correlacioná-los com dados meteorológicos.

### Relação com a indústria espacial
- 🛰️ **Satélites e monitoramento orbital** — origem de todos os dados
- 🌐 **Sensoriamento remoto** — detecção de anomalias térmicas e hídricas
- 📡 **Comunicação global** — alertas geolocalizados em qualquer região
- 🌱 **Sustentabilidade** — resposta rápida reduz impacto ambiental

### ODS da ONU alinhados
- **ODS 9** — Indústria, inovação e infraestrutura
- **ODS 11** — Cidades e comunidades sustentáveis
- **ODS 13** — Ação contra a mudança global do clima

---

## ✨ Funcionalidades

| Tela | Recursos |
|------|----------|
| 🏠 **Home** | Dashboard com indicadores em tempo real, mini gráfico de distribuição por tipo, badge "ao vivo", **teaser de previsão preditiva** que destaca a região mais vulnerável, alertas recentes, pull-to-refresh e animação de entrada |
| 🛰️ **Alertas** | Listagem completa com **busca**, **filtros por tipo**, **filtros por gravidade** e **ordenação** (recentes / gravidade / área) |
| 🔮 **Previsão** | **De alerta a prevenção.** Duas análises preditivas em uma tela: **Risco de Ignição** (NASA SMAP / GRACE-FO — umidade do solo gera um Índice de Vulnerabilidade Espacial 0-100) e **Rota da Fumaça** (NASA MODIS — calcula para onde a fuligem está indo e quais cidades distantes terão o ar afetado) |
| ⭐ **Salvos** | Favoritos persistidos localmente + **histórico recente** de visualização |
| 📄 **Detalhe** | Análise do satélite, dados técnicos do evento, coordenadas, **condição meteorológica** (OpenWeather) e, em queimadas, **rota da fumaça** associada com bússola de vento e cidades impactadas |
| ⚙️ **Config** | **Dark/Light mode** persistido, estatísticas de uso e fontes de dados |

### 🌟 Diferenciais de inovação

- **Índice de Vulnerabilidade Espacial** — combina umidade do solo (SMAP), temperatura, vento e estresse da vegetação em uma pontuação 0-100 com janela de tempo de risco. Transforma o app de _reativo_ em _preditivo_.
- **Rota da Fumaça** — usa dados do MODIS sobre aerossóis e direção dos ventos para alertar cidades distantes que serão afetadas pela fumaça de uma queimada, com ETA por cidade e impacto previsto na qualidade do ar. Conecta o espaço diretamente à saúde pública.

---

## 🧠 Tecnologias

- **React Native** + **Expo SDK 55**
- **TypeScript** (tipagem forte, interfaces, generics)
- **React Navigation** — Bottom Tabs + Native Stack (navegação tipada)
- **Context API** + **Custom Hooks** (estado global)
- **AsyncStorage** (persistência local)
- **Axios** com **interceptors** e tratamento de erro centralizado (Service Layer)

---

## 🧱 Arquitetura

```
src/
 ├── components/    # UI reutilizável (AlertCard, StatCard, Skeleton, etc.)
 ├── screens/       # Telas (Home, Alertas, Detalhe, Salvos, Config)
 ├── navigation/    # RootNavigator (Tabs + Stack tipados)
 ├── services/      # Service layer: api.ts (Axios) + mockData.ts
 ├── hooks/         # Custom hooks (useFilteredAlerts, useDashboardStats)
 ├── contexts/      # Context API (ThemeContext, AlertsContext)
 ├── storage/       # AsyncStorage (favoritos, histórico, tema)
 ├── types/         # Tipagem central
 ├── theme/         # Design System (cores, severidade, tipos)
 ├── utils/         # Formatação (datas, área, tempo relativo)
 └── assets/
```

A aplicação usa **separação de responsabilidades**: as telas consomem dados via Context, que por sua vez chama o Service Layer (Axios). O Service Layer faz **fallback automático para dados simulados** caso a API Java esteja indisponível, mantendo o app sempre funcional para avaliação.

---

## 🌍 APIs utilizadas

- **API DisasterEye (Java)** — back-end que processa dados INPE/NASA (configurável em `src/services/api.ts`)
- **OpenWeather** — https://openweathermap.org/api (clima por coordenada)
- **NASA Open APIs** — https://api.nasa.gov/
- **NASA SMAP** (Soil Moisture Active Passive) — umidade do solo para previsão de risco de ignição
- **NASA GRACE-FO** — déficit hídrico em escala continental
- **NASA MODIS** (Terra/Aqua) — aerossóis e transporte de fumaça
- **INPE Queimadas** — https://terrabrasilis.dpi.inpe.br/queimadas/portal/

> **Configuração:** edite `API_BASE_URL` e `OPENWEATHER_KEY` em `src/services/api.ts`. Sem chave, o app roda com dados simulados realistas.

---

## ▶️ Como executar

Pré-requisitos: **Node.js 18+** e **npm**.

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o projeto
npm start

# Ou diretamente em uma plataforma:
npm run android   # Android
npm run ios       # iOS
npm run web       # Web
```

Use o app **Expo Go** (Android/iOS) e escaneie o QR Code, ou pressione `w` para abrir no navegador.

### Executa em:
- ✅ Android
- ✅ iOS
- ✅ Web

---

## 📸 Imagens

> Adicione aqui capturas de tela do app rodando (Home, Alertas, Detalhe, Dark/Light mode).
>
> `![Home](docs/home.png)` · `![Detalhe](docs/detail.png)`

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

- Repositório GitHub com código-fonte completo (sem `node_modules`)
- README preenchido com instruções, imagens e integrantes
- Aplicação funcional em Android, iOS e Web

---

_DisasterEye — transformando imagens orbitais em alertas que protegem pessoas._ 🛰️🌎
