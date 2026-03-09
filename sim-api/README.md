# VFC Simulation API

This service queues and executes NS-3 VFC simulation jobs, then exposes processed data for the website dashboard.

## API

- `GET /api/health`
- `GET /api/simulations`
- `POST /api/simulations`
- `GET /api/simulations/:id`
- `GET /api/simulations/:id/map`

## Input constraints

`POST /api/simulations` accepts:

- `numVehicles` (1-50)
- `numGnbs` (1-50)
- `numVFCs` (1-50)  // maps to `--numBuses`
- `numCFNs` (1-50)  // maps to `--numRsus`
- `simTime` (5-120)

## Start locally (host process)

```bash
cd /Users/wsj/Documents/Web/wooseongjung-com/sim-api
npm install
npm run dev
```

By default it expects:

- NS-3 root: `/Users/wsj/Documents/ns3_project/ns-3.46`
- Docker container runner: `ns3-dev`
- NS-3 binary in container: `/workspace/ns-3.46/build-linux-out/scratch/ns3.46-v2x-5g-sumo-default`

## Start with Docker

```bash
cd /Users/wsj/Documents/Web/wooseongjung-com
cp .env.sim.example .env.sim
# adjust values if needed

docker compose --env-file .env.sim -f docker-compose.sim.yml up --build
```

This API keeps only the latest 20 runs (`RUNS_KEEP_LATEST`).
