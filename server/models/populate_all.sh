#!/bin/bash

node database.js
node populate_teams.js
node populate_games.js
node populate_geo_data.js
