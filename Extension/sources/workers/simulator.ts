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
    // spoof MICSR
    const MICSR = {
        debug: (...args: any[]) => console.debug('MICSR:', ...args),
        log: (...args: any[]) => console.log('MICSR:', ...args),
        warn: (...args: any[]) => console.warn('MICSR:', ...args),
        error: (...args: any[]) => console.error('MICSR:', ...args),
    }

    // spoof document
    const document = {
        getElementById() {
        }
    };

    // spoof $ so we get useful information regarding where the bugs are
    const $ = (...args: any[]) => console.log(...args);

    /** @type {CombatSimulator} */
    let combatSimulator: any;

    onmessage = (event) => {
        switch (event.data.action) {
            case 'RECEIVE_GAMEDATA':
                // constants
                event.data.constantNames.forEach((name: any) => {
                    self[name] = event.data.constants[name];
                });
                // functions
                event.data.functionNames.forEach((name: any) => {
                    eval(event.data.functions[name]);
                });
                // update modifierData functions
                // @ts-expect-error TS(2304): Cannot find name 'modifierData'.
                for (const m in modifierData) {
                    // @ts-expect-error TS(2304): Cannot find name 'modifierData'.
                    if (modifierData[m].modifyValue !== undefined) {
                        // @ts-expect-error TS(2304): Cannot find name 'modifierData'.
                        if (modifierData[m].modifyValue === 'modifyValue') {
                            // @ts-expect-error TS(2304): Cannot find name 'modifierData'.
                            modifierData[m].modifyValue = MICSR[`${m}ModifyValue`];
                        } else {
                            // @ts-expect-error TS(2304): Cannot find name 'modifierData'.
                            modifierData[m].modifyValue = MICSR[modifierData[m].modifyValue];
                        }
                    }
                }
                // update itemConditionalModifiers
                // @ts-expect-error TS(2304): Cannot find name 'itemConditionalModifiers'.
                for (let i = 0; i < itemConditionalModifiers.length; i++) {
                    // @ts-expect-error TS(2304): Cannot find name 'itemConditionalModifiers'.
                    for (let j = 0; j < itemConditionalModifiers[i].conditionals.length; j++) {
                        // @ts-expect-error TS(2304): Cannot find name 'itemConditionalModifiers'.
                        itemConditionalModifiers[i].conditionals[j].condition = MICSR[`itemConditionalModifiers-condition-${i}-${j}`];
                    }
                }
                const conditionalModifiers = new Map();
                // @ts-expect-error TS(2304): Cannot find name 'itemConditionalModifiers'.
                itemConditionalModifiers.forEach((itemCondition: any) => {
                    conditionalModifiers.set(itemCondition.itemID, itemCondition.conditionals);
                });
                // update Summoning functions
                // @ts-expect-error TS(2304): Cannot find name 'Summoning'.
                for (const i in Summoning.synergies) {
                    // @ts-expect-error TS(2304): Cannot find name 'Summoning'.
                    if (Summoning.synergies[i].conditionalModifiers) {
                        // @ts-expect-error TS(2304): Cannot find name 'Summoning'.
                        for (let k = 0; k < Summoning.synergies[i].conditionalModifiers.length; k++) {
                            // @ts-expect-error TS(2304): Cannot find name 'Summoning'.
                            Summoning.synergies[i].conditionalModifiers[k].condition = MICSR[`SUMMONING-conditional-${i}-${k}`];
                        }
                    }
                }
                // @ts-expect-error TS(2304): Cannot find name 'Summoning'.
                Summoning.getTabletConsumptionXP = getTabletConsumptionXP;
                // @ts-expect-error TS(2304): Cannot find name 'Summoning'.
                Summoning.synergiesByItemID = Summoning.synergies.reduce((synergyMap: any, synergy: any) => {
                    const setSynergy = (item0: any, item1: any) => {
                        let itemMap = synergyMap.get(item0);
                        if (itemMap === undefined) {
                            itemMap = new Map();
                            synergyMap.set(item0, itemMap);
                        }
                        itemMap.set(item1, synergy);
                    };
                    // @ts-expect-error TS(2304): Cannot find name 'Summoning'.
                    const itemID0 = Summoning.marks[synergy.summons[0]].itemID;
                    // @ts-expect-error TS(2304): Cannot find name 'Summoning'.
                    const itemID1 = Summoning.marks[synergy.summons[1]].itemID;
                    setSynergy(itemID0, itemID1);
                    setSynergy(itemID1, itemID0);
                    return synergyMap;
                }, new Map());
                // @ts-expect-error TS(2304): Cannot find name 'Summoning'.
                Summoning.marksByItemID = Summoning.marks.reduce((itemMap: any, mark: any) => {
                    itemMap.set(mark.itemID, mark);
                    return itemMap;
                }, new Map());
                // @ts-expect-error TS(2304): Cannot find name 'Summoning'.
                Summoning.getMarkFromItemID = (itemID: any) => Summoning.marksByItemID.get(itemID);
                // update itemSynergies conditional modifiers
                // @ts-expect-error TS(2304): Cannot find name 'itemSynergies'.
                for (let i = 0; i < itemSynergies.length; i++) {
                    // @ts-expect-error TS(2304): Cannot find name 'itemSynergies'.
                    if (itemSynergies[i].conditionalModifiers) {
                        // @ts-expect-error TS(2304): Cannot find name 'itemSynergies'.
                        for (let j = 0; j < itemSynergies[i].conditionalModifiers.length; j++) {
                            // @ts-expect-error TS(2304): Cannot find name 'itemSynergies'.
                            itemSynergies[i].conditionalModifiers[j].condition = MICSR[`itemSynergies-conditional-${i}-${j}`];
                        }
                    }
                }
                // create itemSynergyMap
                const itemSynergyMap = new Map();
                // @ts-expect-error TS(2304): Cannot find name 'itemSynergies'.
                itemSynergies.forEach((synergy: any) => {
                    synergy.items.forEach((item: any) => {
                        let existingSynergies = itemSynergyMap.get(item);
                        if (existingSynergies === undefined) {
                            existingSynergies = [];
                            itemSynergyMap.set(item, existingSynergies);
                        }
                        existingSynergies.push(synergy);
                    });
                });
                // classes
                event.data.classNames.forEach((name: any) => {
                    eval(event.data.classes[name]);
                });
                // create instances
                (MICSR as any).showModifiersInstance = new (MICSR as any).ShowModifiers('', 'MICSR', false);
                // @ts-expect-error TS(2304): Cannot find name 'SlayerTask'.
                SlayerTask.data = (self as any).slayerTaskData;
                combatSimulator = new CombatSimulator();
                break;
            case 'START_SIMULATION':
                const startTime = performance.now();
                //settings
                // run the simulation
                combatSimulator.simulateMonster(
                    event.data.simPlayer,
                    event.data.monsterID,
                    event.data.dungeonID,
                    event.data.trials,
                    event.data.maxTicks,
                ).then((simResult: any) => {
                    const timeTaken = performance.now() - startTime;
                    postMessage({
                        action: 'FINISHED_SIM',
                        monsterID: event.data.monsterID,
                        dungeonID: event.data.dungeonID,
                        simResult: simResult,
                        selfTime: timeTaken
                    });
                });
                break;
            case 'CANCEL_SIMULATION':
                combatSimulator.cancelSimulation();
                break;
        }
    };

    onerror = (error) => {
        postMessage({
            action: 'ERR_SIM',
            error: error,
        });
    }

    class CombatSimulator {
        cancelStatus: any;

        constructor() {
            this.cancelStatus = false;
        }

        /**
         * Simulation Method for a single monster
         * @param {SimPlayer} player
         * @param {Object} settings
         * @return {Promise<Object>}
         */
        async simulateMonster(simPlayerData: any, monsterID: any, dungeonID: any, trials: any, maxTicks: any) {
            const manager = new (MICSR as any).SimManager();
            const player = manager.player;
            // @ts-expect-error TS(2304): Cannot find name 'DataReader'.
            const reader = new DataReader(simPlayerData);
            player.deserialize(reader);
            player.initForWebWorker();
            try {
                return manager.convertSlowSimToResult(manager.runTrials(monsterID, dungeonID, trials, maxTicks), trials);
            } catch (error) {
                MICSR.error(`Error while simulating monster ${monsterID} in dungeon ${dungeonID}: ${error}`);
                return {
                    simSuccess: false,
                    reason: 'simulation error',
                }
            }
        }

        /**
         * Checks if the simulation has been messaged to be cancelled
         * @return {Promise<boolean>}
         */
        async isCanceled() {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(this.cancelStatus);
                });
            });
        }

        cancelSimulation() {
            this.cancelStatus = true;
        }
    }
})();