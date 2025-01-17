/*  Melvor Idle Combat Simulator

    Copyright (C) <2020>  <Coolrox95>
    Modified Copyright (C) <2020> <Visua0>
    Modified Copyright (C) <2020, 2021> <G. Miclotte>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

(() => {

    const reqs = [
        'util',
    ];

    const setup = () => {
        const MICSR = (window as any).MICSR;

        MICSR.defaultSettings = {
            // version: MICSR.version,
            astrologyModifiers: [],
            course: Array(10).fill(-1),
            courseMastery: {"-1": false},
            // @ts-expect-error TS(2304): Cannot find name 'equipmentSlotData'.
            equipment: Array(Object.getOwnPropertyNames(equipmentSlotData).length).fill(-1),
            // @ts-expect-error TS(2304): Cannot find name 'skillXP'.
            levels: Array(skillXP.length).fill(1),
            // @ts-expect-error TS(2304): Cannot find name 'PETS'.
            petUnlocked: Array(PETS.length).fill(false),
            styles: {
                melee: 'Stab',
                ranged: 'Accurate',
                magic: 'Magic',
            },
            prayerSelected: [],
            ancient: -1,
            aurora: -1,
            autoEatTier: -1,
            cookingMastery: false,
            cookingPool: false,
            currentGamemode: 0,
            curse: -1,
            foodSelected: -1,
            healAfterDeath: true,
            isAncient: false,
            isManualEating: false,
            isSlayerTask: false,
            pillar: -1,
            potionID: -1,
            potionTier: 0,
            standard: 0,
            summoningSynergy: true,
            useCombinationRunes: false,
        }
        // @ts-expect-error TS(2304): Cannot find name 'Skills'.
        MICSR.defaultSettings.levels[Skills.Hitpoints] = 10;

        /**
         * Class to handle importing
         */
        MICSR.Import = class {
            app: any;
            autoEatTiers: any;
            document: any;
            player: any;

            constructor(app: any) {
                this.app = app;
                this.player = app.player;
                this.document = document;
                this.autoEatTiers = [
                    // @ts-expect-error TS(2304): Cannot find name 'GeneralShopPurchases'.
                    GeneralShopPurchases.Auto_Eat_Tier_I,
                    // @ts-expect-error TS(2304): Cannot find name 'GeneralShopPurchases'.
                    GeneralShopPurchases.Auto_Eat_Tier_II,
                    // @ts-expect-error TS(2304): Cannot find name 'GeneralShopPurchases'.
                    GeneralShopPurchases.Auto_Eat_Tier_III,
                ];
            }

            /**
             * Callback for when the import button is clicked
             * @param {number} setID Index of equipmentSets from 0-2 to import
             */
            importButtonOnClick(setID: any) {
                // get potion
                let potionID = -1;
                let potionTier = -1;
                // @ts-expect-error TS(2304): Cannot find name 'herbloreBonuses'.
                const itemID = herbloreBonuses[13].itemID;
                if (itemID !== 0) {
                    // Get tier and potionID
                    // @ts-expect-error TS(2304): Cannot find name 'Herblore'.
                    for (let i = 0; i < Herblore.potions.length; i++) {
                        // @ts-expect-error TS(2304): Cannot find name 'Herblore'.
                        if (Herblore.potions[i].category === 0) {
                            // @ts-expect-error TS(2304): Cannot find name 'Herblore'.
                            for (let j = 0; j < Herblore.potions[i].potionIDs.length; j++) {
                                // @ts-expect-error TS(2304): Cannot find name 'Herblore'.
                                if (Herblore.potions[i].potionIDs[j] === itemID) {
                                    potionID = i;
                                    potionTier = j;
                                }
                            }
                        }
                    }
                }
                // get foodSelected
                // @ts-expect-error TS(2663): Cannot find name 'player'. Did you mean the instan... Remove this comment to see the full error message
                const foodSelected = player.food.currentSlot.item;
                // get cooking mastery for foodSelected
                const foodMastery = foodSelected.masteryID;
                // @ts-expect-error TS(2304): Cannot find name 'Skills'.
                const cookingMastery = foodSelected.id > -1 && foodMastery && foodMastery[0] === Skills.Cooking
                    // @ts-expect-error TS(2304): Cannot find name 'exp'.
                    && exp.xp_to_level(MASTERY[Skills.Cooking].xp[foodMastery[1]]) > 99;

                // get the player's auto eat tier
                let autoEatTier = -1;
                this.autoEatTiers.forEach((id: any) => {
                    // @ts-expect-error TS(2304): Cannot find name 'shopItemsPurchased'.
                    if (shopItemsPurchased.size === 0) {
                        return;
                    }
                    // @ts-expect-error TS(2304): Cannot find name 'shopItemsPurchased'.
                    const ae = shopItemsPurchased.get(`General:${id}`);
                    if (ae === undefined || ae.quantity === 0) {
                        return;
                    }
                    autoEatTier++;
                });

                // get the active astrology modifiers
                const astrologyModifiers = [];
                // @ts-expect-error TS(2304): Cannot find name 'Astrology'.
                for (const constellation of Astrology.constellations) {
                    // @ts-expect-error TS(2304): Cannot find name 'game'.
                    const constellationModifiers = game.astrology.constellationModifiers.get(constellation);
                    const modifiers = {};
                    if (constellationModifiers) {
                        for (const m of [...constellationModifiers.standard, ...constellationModifiers.unique]) {
                            if (m.value === undefined) {
                                if (m.values.length === 0) {
                                    continue;
                                }
                                const skillID = m.values[0][0];
                                const value = m.values[0][1];
                                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                modifiers[m.key] = modifiers[m.key] ?? [];
                                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                const index = modifiers[m.key].findIndex((x: any) => x[0] === skillID);
                                if (index === -1) {
                                    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                    modifiers[m.key] = modifiers[m.key] ?? [];
                                    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                    modifiers[m.key].push([skillID, value]);
                                } else {
                                    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                    modifiers[m.key][index][1] += value;
                                }
                            } else {
                                if (m.value === 0) {
                                    continue;
                                }
                                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                modifiers[m.key] = (modifiers[m.key] ?? 0) + m.value;
                            }
                        }
                    }
                    astrologyModifiers.push(modifiers);
                }

                // get the chosen agility obstacles
                // @ts-expect-error TS(2304): Cannot find name 'Agility'.
                const chosenAgilityObstacles = Array(1 + Math.max(...Agility.obstacles.map((x: any) => x.category))).fill(-1);
                for (let i = 0; i < chosenAgilityObstacles.length; i++) {
                    // @ts-expect-error TS(2304): Cannot find name 'game'.
                    const obstacle = game.agility.builtObstacles.get(i);
                    if (obstacle !== undefined) {
                        chosenAgilityObstacles[i] = obstacle.id;
                    }
                }

                // create settings object
                const settings = {
                    version: MICSR.version,
                    // lists
                    astrologyModifiers: astrologyModifiers,
                    course: chosenAgilityObstacles,
                    // @ts-expect-error TS(2304): Cannot find name 'MASTERY'.
                    courseMastery: MASTERY[Skills.Agility].xp.map((x: any) => x > 13034431),
                    // @ts-expect-error TS(2663): Cannot find name 'player'. Did you mean the instan... Remove this comment to see the full error message
                    equipment: player.equipmentSets[setID].slotArray.map((x: any) => x.occupiedBy === 'None' ? x.item.id : -1),
                    // @ts-expect-error TS(2304): Cannot find name 'skillXP'.
                    levels: skillXP.map((x: any) => Math.max(1, exp.xp_to_level(x) - 1)),
                    // @ts-expect-error TS(2304): Cannot find name 'petUnlocked'.
                    petUnlocked: petUnlocked,
                    // objects
                    // @ts-expect-error TS(2663): Cannot find name 'player'. Did you mean the instan... Remove this comment to see the full error message
                    styles: {...player.attackStyles},
                    // simple values
                    // @ts-expect-error TS(2663): Cannot find name 'player'. Did you mean the instan... Remove this comment to see the full error message
                    ancient: player.spellSelection.ancient,
                    // @ts-expect-error TS(2663): Cannot find name 'player'. Did you mean the instan... Remove this comment to see the full error message
                    aurora: player.spellSelection.aurora,
                    autoEatTier: autoEatTier,
                    cookingMastery: cookingMastery,
                    // @ts-expect-error TS(2304): Cannot find name 'getMasteryPoolProgress'.
                    cookingPool: getMasteryPoolProgress(Skills.Cooking) >= 95,
                    // @ts-expect-error TS(2304): Cannot find name 'currentGamemode'.
                    currentGamemode: currentGamemode,
                    // @ts-expect-error TS(2663): Cannot find name 'player'. Did you mean the instan... Remove this comment to see the full error message
                    curse: player.spellSelection.curse,
                    foodSelected: foodSelected.id,
                    healAfterDeath: this.player.healAfterDeath,
                    // @ts-expect-error TS(2663): Cannot find name 'player'. Did you mean the instan... Remove this comment to see the full error message
                    isAncient: player.spellSelection.ancient !== -1,
                    isManualEating: this.player.isManualEating,
                    isSlayerTask: this.player.isSlayerTask,
                    // @ts-expect-error TS(2304): Cannot find name 'game'.
                    pillar: game.agility.builtPassivePillar === undefined ? -1 : game.agility.builtPassivePillar.id,
                    potionID: potionID,
                    potionTier: potionTier,
                    // @ts-expect-error TS(2663): Cannot find name 'player'. Did you mean the instan... Remove this comment to see the full error message
                    prayerSelected: [...player.activePrayers],
                    // @ts-expect-error TS(2663): Cannot find name 'player'. Did you mean the instan... Remove this comment to see the full error message
                    standard: player.spellSelection.standard,
                    summoningSynergy: this.player.summoningSynergy, // TODO: import mark levels
                    // @ts-expect-error TS(2304): Cannot find name 'useCombinationRunes'.
                    useCombinationRunes: useCombinationRunes,
                };

                // import settings
                this.importSettings(settings);
                // update app and simulator objects
                this.update();
            }

            exportSettings() {
                const courseMastery = {};
                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                this.player.course.forEach((o: any, i: any) => courseMastery[o] = this.player.courseMastery[i]);
                return {
                    version: MICSR.version,
                    // lists
                    astrologyModifiers: this.player.activeAstrologyModifiers,
                    course: [...this.player.course],
                    courseMastery: courseMastery,
                    equipment: this.player.equipment.slotArray.map((x: any) => x.item.id),
                    levels: [...this.player.skillLevel],
                    petUnlocked: [...this.player.petUnlocked],
                    // objects
                    styles: {...this.player.attackStyles},
                    prayerSelected: [...this.player.activePrayers],
                    // simple values
                    ancient: this.player.spellSelection.ancient,
                    aurora: this.player.spellSelection.aurora,
                    autoEatTier: this.player.autoEatTier,
                    cookingMastery: this.player.cookingMastery,
                    cookingPool: this.player.cookingPool,
                    currentGamemode: this.player.currentGamemode,
                    curse: this.player.spellSelection.curse,
                    foodSelected: this.player.food.currentSlot.item.id,
                    healAfterDeath: this.player.healAfterDeath,
                    isAncient: this.player.spellSelection.ancient > -1,
                    isManualEating: this.player.isManualEating,
                    isSlayerTask: this.player.isSlayerTask,
                    pillar: this.player.pillar,
                    potionID: this.player.potionID,
                    potionTier: this.player.potionTier,
                    standard: this.player.spellSelection.standard,
                    summoningSynergy: this.player.summoningSynergy,
                    useCombinationRunes: this.player.useCombinationRunes,
                };
            }

            importSettings(settings: any) {
                if (settings.version !== MICSR.version) {
                    MICSR.warn(`Importing MICSR ${settings.version} settings in MICSR ${MICSR.version}.`)
                }
                // validate
                for (const prop in MICSR.defaultSettings) {
                    if (settings[prop] === undefined) {
                        MICSR.error(`No valid ${prop} data imported, using default ${MICSR.defaultSettings[prop]}.`)
                        settings[prop] = MICSR.defaultSettings[prop];
                    }
                }
                // import settings
                this.importEquipment(settings.equipment);
                this.importLevels(settings.levels);
                this.importStyle(settings.styles);
                this.importSpells({
                    ancient: settings.ancient,
                    aurora: settings.aurora,
                    curse: settings.curse,
                    standard: settings.standard,
                });
                this.importPrayers(settings.prayerSelected);
                this.importPotion(settings.potionID, settings.potionTier);
                this.importPets(settings.petUnlocked);
                this.importAutoEat(settings.autoEatTier, settings.foodSelected, settings.cookingPool, settings.cookingMastery);
                this.importManualEating(settings.isManualEating);
                this.importHealAfterDeath(settings.healAfterDeath);
                this.importSlayerTask(settings.isSlayerTask);
                this.importGameMode(settings.currentGamemode);
                this.importUseCombinationRunes(settings.useCombinationRunes);
                this.importAgilityCourse(settings.course, settings.courseMastery, settings.pillar);
                this.importSummoningSynergy(settings.summoningSynergy);
                this.importAstrology(settings.astrologyModifiers);
                // notify completion
                this.app.notify('Import completed.');
            }

            update() {
                // update and compute values
                this.app.updateSpellOptions();
                this.app.updatePrayerOptions();
                this.app.updateCombatStats();
            }

            importEquipment(equipment: any) {
                // clear previous items
                this.player.equipment.unequipAll();
                // @ts-expect-error TS(2304): Cannot find name 'equipmentSlotData'.
                for (const slot in equipmentSlotData) {
                    // @ts-expect-error TS(2304): Cannot find name 'equipmentSlotData'.
                    const slotID = equipmentSlotData[slot].id;
                    this.app.setEquipmentImage(slotID, -1);
                }
                // load new items
                // @ts-expect-error TS(2304): Cannot find name 'equipmentSlotData'.
                for (const slot in equipmentSlotData) {
                    // @ts-expect-error TS(2304): Cannot find name 'equipmentSlotData'.
                    const slotID = equipmentSlotData[slot].id;
                    const itemID = equipment[slotID];
                    if (itemID === -1) {
                        continue;
                    }
                    this.app.equipItem(slotID, itemID);
                }
                // update style drop down
                this.app.updateStyleDropdowns();
            }

            importLevels(levels: any) {
                this.app.skillKeys.forEach((key: any) => {
                    // @ts-expect-error TS(2304): Cannot find name 'Skills'.
                    this.document.getElementById(`MCS ${key} Input`).value = levels[Skills[key]];
                });
                this.player.skillLevel = [...levels];
            }

            importStyle(styles: any) {
                [
                    'melee',
                    'ranged',
                    'magic',
                ].forEach(style => {
                    this.player.setAttackStyle(style, styles[style]);
                    // @ts-expect-error TS(2304): Cannot find name 'attackStyles'.
                    this.document.getElementById(`MCS ${style} Style Dropdown`).selectedIndex = attackStyles[styles[style]].id % 3;
                });
            }

            importSpells(spellSelection: any) {
                // Set all active spell UI to be disabled
                Object.keys(this.app.combatData.spells).forEach((spellType) => {
                    const spellID = this.player.spellSelection[spellType];
                    this.app.disableSpell(spellType, spellID);
                    this.app.enableSpell(spellType, spellSelection[spellType]);
                });
                this.app.spellSanityCheck();
            }

            importPrayers(prayerSelected: any) {
                // toggle old prayers off
                this.player.activePrayers.clear();
                // Update prayers
                // @ts-expect-error TS(2304): Cannot find name 'PRAYER'.
                PRAYER.forEach((prayer: any) => {
                    const prayButton = this.document.getElementById(`MCS ${this.app.getPrayerName(prayer.id)} Button`);
                    if (prayerSelected.includes(prayer.id)) {
                        this.app.selectButton(prayButton);
                        this.player.activePrayers.add(prayer.id);
                    } else {
                        this.app.unselectButton(prayButton);
                    }
                });
            }

            importPotion(potionID: any, potionTier: any) {
                // Deselect potion if selected
                if (this.player.potionSelected) {
                    this.app.unselectButton(this.document.getElementById(`MCS ${this.app.getPotionName(this.player.potionID)} Button`));
                    this.player.potionSelected = false;
                    this.player.potionID = -1;
                }
                // Select new potion if applicable
                if (potionID !== -1) {
                    this.player.potionSelected = true;
                    this.player.potionID = potionID;
                    this.app.selectButton(this.document.getElementById(`MCS ${this.app.getPotionName(this.player.potionID)} Button`));
                }
                // Set potion tier if applicable
                if (potionTier !== -1) {
                    this.player.potionTier = potionTier;
                    this.app.updatePotionTier(potionTier);
                    // Set dropdown to correct option
                    this.document.getElementById('MCS Potion Tier Dropdown').selectedIndex = potionTier;
                }
            }

            importPets(petUnlocked: any) {
                // Import PETS
                petUnlocked.forEach((owned: any, petID: any) => {
                    this.player.petUnlocked[petID] = owned;
                    if (this.app.petIDs.includes(petID)) {
                        if (owned) {
                            // @ts-expect-error TS(2304): Cannot find name 'PETS'.
                            this.app.selectButton(this.document.getElementById(`MCS ${PETS[petID].name} Button`));
                        } else {
                            // @ts-expect-error TS(2304): Cannot find name 'PETS'.
                            this.app.unselectButton(this.document.getElementById(`MCS ${PETS[petID].name} Button`));
                        }
                    }
                    if (petID === 4 && owned) this.document.getElementById('MCS Rock').style.display = '';
                });
            }

            importAutoEat(autoEatTier: any, foodSelected: any, cookingPool: any, cookingMastery: any) {
                // Import Food Settings
                this.player.autoEatTier = autoEatTier;
                this.document.getElementById('MCS Auto Eat Tier Dropdown').selectedIndex = autoEatTier + 1;
                this.app.equipFood(foodSelected);
                this.checkRadio('MCS 95% Cooking Pool', cookingPool);
                this.player.cookingPool = cookingPool;
                this.checkRadio('MCS 99 Cooking Mastery', cookingMastery);
                this.player.cookingMastery = cookingMastery;
            }

            importManualEating(isManualEating: any) {
                this.checkRadio('MCS Manual Eating', isManualEating);
                this.player.isManualEating = isManualEating;
            }

            importHealAfterDeath(healAfterDeath: any) {
                this.checkRadio('MCS Heal After Death', healAfterDeath);
                this.player.healAfterDeath = healAfterDeath;
            }

            importSlayerTask(isSlayerTask: any) {
                // Update slayer task mode
                this.checkRadio('MCS Slayer Task', isSlayerTask);
                this.player.isSlayerTask = isSlayerTask;
                this.app.slayerTaskSimsToggle();
            }

            importGameMode(currentGamemode: any) {
                this.player.currentGamemode = currentGamemode;
                this.document.getElementById('MCS Game Mode Dropdown').selectedIndex = currentGamemode;
            }

            importSummoningSynergy(summoningSynergy: any) {
                // Update summoningSynergy
                this.player.summoningSynergy = summoningSynergy;
            }

            importUseCombinationRunes(useCombinationRunes: any) {
                // Update hardcore mode
                this.checkRadio('MCS Use Combination Runes', useCombinationRunes);
                this.player.useCombinationRunes = useCombinationRunes;
            }

            importAgilityCourse(course: any, masteries: any, pillar: any) {
                this.app.agilityCourse.importAgilityCourse(course, masteries, pillar);
            }

            importAstrology(astrologyModifiers: any) {
                this.player.activeAstrologyModifiers.forEach((constellation: any, idx: any) => {
                    for (const modifier in constellation) {
                        // import values and set rest to 0
                        if (astrologyModifiers[idx] !== undefined && astrologyModifiers[idx][modifier] !== undefined) {
                            constellation[modifier] = astrologyModifiers[idx][modifier];
                            if (constellation[modifier].push) {
                                // filter non combat skill modifiers
                                constellation[modifier] = constellation[modifier].filter((x: any) => MICSR.showModifiersInstance.relevantModifiers.combat.skillIDs.includes(x[0])
                                );
                            }
                        } else if (constellation[modifier].push) {
                            // keep entries per skill, but set value to 0
                            constellation[modifier] = constellation[modifier].map((x: any) => [x[0], 0]);
                        } else {
                            constellation[modifier] = 0;
                        }
                        // update input fields
                        if (constellation[modifier].push) {
                            constellation[modifier].forEach((x: any) => {
                                // @ts-expect-error TS(2304): Cannot find name 'Astrology'.
                                this.document.getElementById(`MCS ${Astrology.constellations[idx].name}-${Skills[x[0]]}-${modifier} Input`).value = x[1]
                            });
                        } else {
                            // @ts-expect-error TS(2304): Cannot find name 'Astrology'.
                            this.document.getElementById(`MCS ${Astrology.constellations[idx].name}-${modifier} Input`).value = constellation[modifier];
                        }
                    }
                });
                this.app.updateAstrologySummary();
            }

            checkRadio(baseID: any, check: any) {
                const yesOrNo = check ? 'Yes' : 'No';
                this.document.getElementById(`${baseID} Radio ${yesOrNo}`).checked = true;
            }
        }
    }

    let loadCounter = 0;
    const waitLoadOrder = (reqs: any, setup: any, id: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'characterSelected'.
        if (typeof characterSelected === typeof undefined) {
            return;
        }
        // @ts-expect-error TS(2304): Cannot find name 'characterSelected'.
        if (characterSelected && !characterLoading) {
            loadCounter++;
        }
        if (loadCounter > 100) {
            console.log('Failed to load ' + id);
            return;
        }
        // check requirements
        // @ts-expect-error TS(2304): Cannot find name 'characterSelected'.
        let reqMet = characterSelected && !characterLoading;
        if ((window as any).MICSR === undefined) {
            reqMet = false;
            console.log(id + ' is waiting for the MICSR object');
        } else {
            for (const req of reqs) {
                if ((window as any).MICSR.loadedFiles[req]) {
                    continue;
                }
                reqMet = false;
                // not defined yet: try again later
                if (loadCounter === 1) {
                    (window as any).MICSR.log(id + ' is waiting for ' + req);
                }
            }
        }
        if (!reqMet) {
            setTimeout(() => waitLoadOrder(reqs, setup, id), 50);
            return;
        }
        // requirements met
        (window as any).MICSR.log('setting up ' + id);
        setup();
        // mark as loaded
        (window as any).MICSR.loadedFiles[id] = true;
    }
    waitLoadOrder(reqs, setup, 'Import');

})();