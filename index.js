const axios = require("axios");

const MOD = process.argv[2];
const MODE = 0; // osu! mode, should switch to an argument when other modes are needed
let validMods = [];
let incompatibleMods = ["RD", "AT", "CN", "TD", "SV2"];

// https://github.com/ppy/osu-web/blob/master/database/mods.json
const url = "https://raw.githubusercontent.com/ppy/osu-web/master/database/mods.json";

axios
    .get(url)
    .then((response) => {
        const modes = response.data;
        let modFound = false;

        modes[MODE].Mods.forEach((mod) => {
            // store all mods (excluding the current mod)
            if (mod.Acronym !== MOD) {
                validMods.push(mod.Acronym);
            } else {
                // store relevant incompatible mods
                incompatibleMods = [...incompatibleMods, ...mod.IncompatibleMods];
                modFound = true;
            }
        });

        if (!modFound) {
            console.error(`Error: mod "${MOD}" not found.`);
            process.exit(1);
        }

        // filter incompatible mods
        incompatibleMods.forEach((incompatibleMod) => {
            validMods = validMods.filter((mod) => mod !== incompatibleMod);
        });

        console.log(validMods.join(","));
    })
    .catch((error) => console.error("Error fetching the JSON data:", error));
