# CPAN Map — Texas Child Psychiatry Access Network Interactive Map

An interactive map visualizing the geographic coverage areas of the **Texas Child Psychiatry Access Network (CPAN)** hub institutions, built to help providers and patients identify their nearest CPAN resource.

## Overview

CPAN connects Texas primary care providers with child psychiatry expertise through regional hub institutions. This map displays which hub serves each area of Texas, with color-coded coverage boundaries and institution logos. It supports outreach and navigation for the statewide mental health access network.

## Hub Institutions Shown

BCM · Dell Medical School (UT Austin) · Texas A&M · TTUHSC · TTUHSC El Paso · UNTHSC · UT Health Houston · UT Health San Antonio · UT Health Tyler · UTMB · UTRGV · UT Southwestern

## Tech Stack

- **Mapbox GL JS** — interactive vector tile map with choropleth coverage layers
- **GeoJSON** — institution coverage areas (`js/inst-areas.geojson`) and region polygons (`js/region-areas.geojson`)
- **Bootstrap 4** — responsive layout
- **Vanilla JavaScript / jQuery** — interactivity and hover/click events

## Running Locally

No build step required. Serve with a local static server (GeoJSON loading requires HTTP, not `file://`):

```bash
npx serve .
```

> **Note:** A Mapbox access token is embedded in `js/app.js`. Replace `mapboxgl.accessToken` with your own token if needed.
