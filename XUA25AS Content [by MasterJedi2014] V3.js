/*	-INFORMATION-
	Subject:	Subclasses (a.k.a. Archetype)
	Effect:		This script adds the subclasses from XUA25AS.
				This version of the script only adds the Arcana Cleric, the Arcane Archer, and the Tattooed Warrior; Later versions will add the other subclasses from this Unearthed Arcana article. These Subclasses are a transciption of the subclasses found in XUA25AS, transcribed by MasterJedi2014.
	Code by:	MasterJedi2014, using MorePurpleMoreBetter's code as reference
	Date:		2025-07-20 (sheet v13.2.3)
	Notes:		This file will start by shunting the old subclasses into "Legacy" subclasses using code primarily developed by Shroo.
				It will thereafter define the new UA subclasses.
*/

var iFileName = "XUA25AS Content [by MasterJedi2014] V3.js";
RequiredSheetVersion("13.2.3");

/*	-SCRIPT AUTHOR NOTE-
	This file should be installed AFTER the other 2024 PHB & DMG scripts made by ThePokésimmer.
*/

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //
// >>> Define Sources for everything first >>> //
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //

SourceList["XUA25AS"] = {
	name : "Unearthed Arcana 2025: Arcane Subclasses",
	abbreviation : "XUA25AS",
	date : "2025/06/26",
	group : "UA:5.24E",
	url : "https://media.dndbeyond.com/compendium-images/ua/arcane-subclasses/zepvK7DBkeSt6dqv/UA2025-ArcaneSubclasses.pdf",
};

SourceList["MJ:HB"] = {
	name : "MasterJedi2014's Homebrew",
	abbreviation : "MJ:HB",
	date : "2024/04/20",
};

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //
// >>> Define functions used for refactoring old classes & subclasses >>> //
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //

// Coded By: ThePokésimmer with contributions from morepurplemorebetter (Joost), MasterJedi2014, Shroo, Reading Toskr, TrackAtNite, evanelric, TappyTap, Mente, Rocky, ShadowzAll, and Jeremy
// Functions
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
function legacyClassRefactor(classKey, newClass) {
  if (!(classKey in ClassList)) {
    ClassList[classKey] = newClass;
  } else {
    newClass.subclasses = ClassList[classKey].subclasses;
    ClassList[classKey] = newClass;
  }
}
function archiveSubClass(classKey, subClass, newClassName) {
  subClass.subname = subClass.subname + " - 2014";
  if ('fullname' in subClass) {
    subClass.fullname = subClass.fullname + " - 2014";
  }
  subClass.source = [["LEGACYCLASS", 1]];
  for (var i of ClassList[classKey].subclasses[1]) {
    if (ClassSubList[i].regExpSearch.test(newClassName)) {
      var regex = "(?=^.*" + subClass.regExpSearch.source + ".*$)(?!^" + escapeRegExp(newClassName) + "$)";
      ClassSubList[i].regExpSearch = new RegExp(regex, 'i');
    }
  }
}
function legacySubClassRefactor(classKey, subClassKey, nSC) {
  var newSubClassName = classKey + "-" + subClassKey;
  var prv = null;
  if (newSubClassName in ClassSubList) {
    prv = ClassSubList[newSubClassName];
    AddSubClass(classKey, subClassKey + "_2014", prv);
    ClassSubList[newSubClassName] = nSC;
  } else {
    if ('replaces' in nSC && classKey + '-' + nSC.replaces in ClassSubList) {
        prv = ClassSubList[classKey + '-' + nSC.replaces];
      }
    AddSubClass(classKey, subClassKey, nSC);
  }
  if (prv != null) {
    var newRegex = nSC.regExpSearch;
    var bc = ClassList[classKey];
    var newClassName = nSC.fullname ? nSC.fullname : bc.name + " (" + nSC.subname + ")";
    archiveSubClass(classKey, prv, newClassName);
    nSC.regExpSearch = newRegex;
  }
    return nSC;
}

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //
// >>> Define new/replacement subclass content >>> //
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //

legacySubClassRefactor("cleric", "arcana", {
  regExpSearch: /^(?=.*(cleric))(?=.*(arcana)).*$/i,
  subname: "Arcana Domain",
  source: [["XUA25AS", 1]],
  replaces: "arcana domain",
  spellcastingExtra: ["detect magic", "magic missile", "magic weapon", "nystul's magic aura", "counterspell", "dispel magic", "arcane eye", "leomund's secret chest", "bigby's hand", "teleportation circle"],
  features: {
    "subclassfeature3": {
      name : "Arcane Initiate",
	  source : [["XUA25AS", 2]],
	  minlevel : 3,
	  description : desc([
		"I gain Expertise with Arcana and two wizard cantrips that count as cleric cantrips",
	  ]),
	  skills : ["Arcana", "full"],
	  spellcastingBonus : [{
		name : "Arcane Initiate",
		"class" : "wizard",
		level : [0, 0],
		times : 2
	  }],
    },
    "subclassfeature3.1": {
      name : "Channel Divinity: Modify Magic",
	  source : [["XUA25AS", 2]],
	  minlevel : 3,
	  description : desc([
		"When I cast a spell, I can expend one use of my Channel Divinity \u0026 change the spell in one of the following ways (no action required).",
		" \u2022 Fortifying Spell. One target of the spell gains a number of Temp HP equal to 2d8 + my Cleric level.",
		" \u2022 Tenacious Spell. When I cast a spell that forces a creature to make a saving throw, choose one target of the spell I can see. Roll 1d6 \u0026 apply the number rolled as a penalty to the target's saving throw."
	  ]),
    },
    "subclassfeature6": {
      name: "Dispelling Recovery",
      source: [["XUA25AS", 2]],
      minlevel: 6,
      description: desc([
        "Immediately after I cast a spell with a spell slot that restores HP to a creature or ends a condition on a creature, I can cast Dispel Magic on the creature as a Bonus Action without expending a spell slot.",
		"I can use this feature a number of times equal to my Wis modifier (minimum of once), \u0026 I regain all expended uses when I finish a Long Rest."
      ]),
	  action : [["bonus action", "Channel Divinity: Dispelling Recovery"]],
	  usages : "Wisdom modifier per ",
	  usagescalc : "event.value = Math.max(1, What('Wis Mod'));",
	  recovery : "long rest",
    },
    "subclassfeature17": {
      name : "Arcane Mastery",
	  source : [["XUA25AS", 2]],
	  minlevel : 17,
	  description : desc([
		"I add four wizards spells, a 6th, 7th, 8th, and 9th-level spell, to my domain spells.",
		"As any domain spell, these spells are automatically prepared and count as cleric spells.",
		"Whenever I gain a Cleric level, I can replace one of these spells with another Wizard spell of the same level.",
	  ]),
	  spellcastingBonus : [{
		name : "Arcane Mastery (6)",
		"class" : "wizard",
		level : [6, 6],
		firstCol : 'markedbox'
	  }, {
		name : "Arcane Mastery (7)",
		"class" : "wizard",
		level : [7, 7],
		firstCol : 'markedbox'
	  }, {
		name : "Arcane Mastery (8)",
		"class" : "wizard",
		level : [8, 8],
		firstCol : 'markedbox'
	  }, {
		name : "Arcane Mastery (9)",
		"class" : "wizard",
		level : [9, 9],
		firstCol : 'markedbox'
	  }],
    },
  },
});
legacySubClassRefactor("fighter", "arcane archer", {
  regExpSearch: /^(?=.*(arcane))(?=.*(archer)).*$/i,
  subname: "Arcane Archer",
  source: [["XUA25AS", 2]],
  replaces: "arcane archer",
  features: {
    "subclassfeature3": {
      name : "Arcane Archer Lore",
	  source : [["XUA25AS", 2]],
	  minlevel : 3,
	  description : desc([
		"I gain Proficiency in Arcana \u0026 Nature. If I already have Prof in one or both, I instead gain Prof with a skill (or 2) of my choice.",
		"I know either the Druidcraft or Prestidigitation cantrip. Intelligence is my spellcasting ability for it.",
	  ]),
	  skills : [
		"Arcana",
		"Nature",
	  ],
	  spellcastingBonus : [{
		name : "Arcane Archer Lore",
		spellcastingAbility : 4,
		selection : ["druidcraft", "prestidigitation"],
		times : 1
	  }],
    },
    "subclassfeature3.1": {
      name : "Arcane Shot",
	  source : [["XUA25AS", 2]],
	  minlevel : 3,
	  description : desc([
		'Arcane Shot Options. I learn two Arcane Shot options of my choice from the "Choose Feature" button above.',
		"  I learn an additional Arcane Shot option of my choice when I reach Fighter lvls 7, 10, 15, \u0026 18. When I learn a new Arcane Shot option, I can replace one option I know with a different one.",
		"Using Arcane Shot. Once per turn when I make a ranged attack using a weapon with the Ammunition property, I can apply one of my Arcane Shot options to that attack. I decide to use the option when I hit a creature and deal damage to it unless the option doesn't involve an attack roll.",
		"  I can use this feature my Int mod (min 1) number of times per Short/Long Rest, regaining all uses after a Short/Long Rest.",
		"Saving Throws. If an Arcane Shot option requires a saving throw, the DC equals 8 + my Int mod + my Prof Bonus.",
	  ]),
	  additional : levels.map(function (n) {
		return n < 2 ? "" : (n < 7 ? 2 : n < 10 ? 3 : n < 15 ? 4 : n < 18 ? 5 : 6) + " Arcane Shot options known; 1d" + (n < 10 ? 6 : n < 15 ? 8 : n < 18 ? 10 : 12) + " Arcane Shot Die size";
	  }),
	  usages : "Intelligence modifier per ",
	  usagescalc : "event.value = Math.max(1, What('Int Mod'));",
	  recovery : "short rest",
	  extraname: "Arcane Shot",
	  extrachoices: ["Banishing Shot", "Beguiling Shot", "Bursting Shot", "Enfeebling Shot", "Grasping Shot", "Piercing Shot", "Seeking Shot", "Shadow Shot"],
	  extraTimes: [0, 0, 2, 2, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 6, 6, 6],
	  "banishing shot": {
		name: "Banishing Shot",
		description: desc([
		  "My magic temporarily sequesters my target in a harmless demiplane. The creature I hit takes additional Psychic damage equal to one roll of my Arcane Shot Die and must succeed on a Charisma saving throw or be banished. While banished, the creature has the Incapacitated condition and a Speed of 0. At the end of its next turn, the target reappears in the space it left or, if that space is occupied, in the nearest unoccupied space.",
		]),
	  },
	  "beguiling shot": {
		name: "Beguiling Shot",
		description: desc([
		  "My magic causes the ammunition to temporarily beguile my target. The creature I hit takes additional Psychic damage equal to two rolls of my Arcane Shot Die and must succeed on a Wisdom saving throw or have the Charmed condition until the start of my next turn, treating either myself or one of my allies within 30 feet of the target (my choice) as the charmer. The Charmed condition ends early if the charmer attacks the target, deals damage to it, or forces it to make a saving throw.",
		]),
	  },
	  "bursting shot": {
		name: "Bursting Shot",
		description: desc([
		  "I imbue my ammunition with explosive force energy. Immediately after I deal damage to the creature, my target and each creature within a 10-foot Emanation originating from the target takes Force damage equal to two rolls of my Arcane Shot Die.",
		]),
	  },
	  "enfeebling shot": {
		name: "Enfeebling Shot",
		description: desc([
		  "My ammunition saps my target's strength. The creature I hit takes additional Necrotic damage equal to two rolls of my Arcane Shot Die. The target must also succeed on a Constitution saving throw or have the Poisoned condition until the end of its next turn. Whenever a target Poisoned in this way hits with an attack roll, it subtracts an amount equal to one roll of my Arcane Shot Die from the total damage of that attack.",
		]),
	  },
	  "grasping shot": {
		name: "Grasping Shot",
		description: desc([
		  "My ammunition creates clutching brambles around my target. The creature I hit takes additional Slashing damage equal to one roll of my Arcane Shot Die and must succeed on a Strength saving throw or have the Restrained condition until the start of my next turn. The target or a creature within reach of it can take an Action to make a Strength (Athletics) check against my Arcane Shot DC, removing the brambles and ending the Restrained condition on the target on a successful check.",
		]),
	  },
	  "piercing shot": {
		name: "Piercing Shot",
		description: desc([
		  "I give my ammunition an ethereal quality. When I use this option, I don't make an attack roll for the attack. Instead, the ammunition shoots forward in a 30-foot Line that is 1 foot wide, originating from me, then vanishes. The Line ignores cover, as the ammunition phases through solid objects. Each creature in the Line must make a Dexterity saving throw. On a failed save, a creature takes damage as if it were hit plus additional Piercing damage equal to two rolls of my Arcane Shot Die. On a successful save, a creature takes half as much damage.",
		]),
	  },
	  "seeking shot": {
		name: "Seeking Shot",
		description: desc([
		  "I grant my ammunition the ability to seek out a target. When I use this option, I don't make an attack roll for the attack. Instead, choose one creature I have seen in the last minute. The ammunition flies toward that creature, moving around corners if necessary and ignoring Half Cover and Three-Quarters Cover. If the target is within your weapon's long range, the target must make a Dexterity saving throw. Otherwise, the ammunition disappears after traveling as far as it can. On a failed save, the target takes damage as if it were hit plus additional Force damage equal to two rolls of my Arcane Shot Die, and I learn the target's current location. On a successful save, the target takes half as much damage only.",
		]),
	  },
	  "shadow shot": {
		name: "Shadow Shot",
		description: desc([
		  "My magic occludes my foe's vision with shadows. The creature I hit takes additional Psychic damage equal to one roll of my Arcane Shot Die, and it must succeed on a Wisdom saving throw or have the Blinded condition until the end of its next turn.",
		]),
	  },
    },
    "subclassfeature7": {
      name: "Curving Shot",
      source: [["XUA25AS", 3]],
      minlevel: 7,
      description: desc([
        "If I make an attack roll with a weapon with the Ammunition property and miss, as a Bonus Action immediately after the attack, I can make an extra attack with the same",
		"   weapon against a different target that I can see, that is within the weapon's long range, and that isn't behind Total Cover. This extra attack doesn't require ammunition."
      ]),
	  action : [["bonus action", " "]],
    },
	"subclassfeature7.1": {
      name: "Ever Ready Shot",
      source: [["XUA25AS", 3]],
      minlevel: 7,
      description: desc([
        "When I roll Initiative and have no uses of Arcane Shot left, I regain one expended use of it."
      ]),
    },
  },
});
AddSubClass("monk", "tattooed warrior", {
  regExpSearch: /^(?=.*(monk))(?=.*(tattooed))(?=.*(warrior)).*$/i,
  subname: "Tattooed Warrior",
  source: [["XUA25AS", 4]],
  features: {
    "subclassfeature3": {
      name : "Magic Tattoos",
	  source : [["XUA25AS", 4]],
	  minlevel : 3,
	  description : desc([
		"I gain magical tattoos on my body at various levels. The tattoos appear on my body wherever I wish. Damage or injury doesn't impair my magic tattoos' function. A magic tattoo's depiction can look like a brand, scarification, a birthmark, patterns of scale, or any other cosmetic alteration.",
		"If a tattoo's effect requires a saving throw, the DC equals 8 + my Wis mod + your Prof Bonus. My spellcasting ability for spells granted by a tattoo is Wisdom.",
		"Whenever I finish a Long Rest, I can reshape one of my magic tattoos, changing the option I chose from one list to another option on the same list.",
	  ]),
	  extraname: "Beast Tattoos",
	  extrachoices: ["Bat Tattoo", "Butterfly Tattoo", "Chameleon Tattoo", "Crane Tattoo", "Horse Tattoo", "Spider Tattoo", "Tortoise Tattoo"],
	  extraTimes: [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	  "bat tattoo": {
		name: "Bat Tattoo",
		description: desc([
		  "I know the Dancing Lights cantrip. When I expend 1 Focus Point to use Patient Defense or Step of the Wind, I gain Blindsight with a range of 10 feet for 1 minute.",
		]),
		spellcastingBonus : [{
		  name : "Bat Tattoo",
		  spellcastingAbility : 5,
		  spells : ["dancing lights"],
		  selection : ["dancing lights"],
		}],
	  },
	  "butterfly tattoo": {
		name: "Butterfly Tattoo",
		description: desc([
		  "I know the Light cantrip. I can expend 1 Focus Point to cast Silent Image without Material components.",
		]),
		spellcastingBonus : [{
		  name : "Butterfly Tattoo: Light",
		  spellcastingAbility : 5,
		  spells : ["light"],
		  selection : ["light"],
		}, {
		  name : "Butterfly Tattoo: Silent Image",
		  spellcastingAbility : 5,
		  spells : ["silent image"],
		  selection : ["silent image"],
		  firstCol : 1,
		}],
		spellFirstColTitle : "FP",
		prereqeval : function(v) { return classes.known.monk.level >= 3; },
		spellChanges : {
		  "silent image" : {
			components : "V,S",
			compMaterial : "",
			changes : "With the Butterfly Tattoo, I can cast Silent Image without a material component."
		   }
		}
	  },
	  "chameleon tattoo": {
		name: "Chameleon Tattoo",
		description: desc([
		  "I know the Minor Illusion cantrip. I can expend 1 Focus Point to cast Disguise Self.",
		]),
		spellcastingBonus : [{
		  name : "Chameleon Tattoo: Minor Illusion",
		  spellcastingAbility : 5,
		  spells : ["minor illusion"],
		  selection : ["minor illusion"],
		}, {
		  name : "Chameleon Tattoo: Disguise Self",
		  spellcastingAbility : 5,
		  spells : ["disguise self"],
		  selection : ["disguise self"],
		  firstCol : 1,
		}],
		spellFirstColTitle : "FP",
	  },
	  "crane tattoo": {
		name: "Crane Tattoo",
		description: desc([
		  "I know the Guidance cantrip. When I miss a creature with an attack granted by my Flurry of Blows, I have Advantage on attack rolls for any remaining Unarmed Strikes with that use of Flurry of Blows.",
		]),
		spellcastingBonus : [{
		  name : "Crane Tattoo",
		  spellcastingAbility : 5,
		  spells : ["guidance"],
		  selection : ["guidance"],
		}],
	  },
	  "horse tattoo": {
		name: "Horse Tattoo",
		description: desc([
		  "I know the Message cantrip. I can expend 1 Focus Point to cast Longstrider without Material components.",
		]),
		spellcastingBonus : [{
		  name : "Horse Tattoo: Message",
		  spellcastingAbility : 5,
		  spells : ["message"],
		  selection : ["message"],
		}, {
		  name : "Horse Tattoo: Longstrider",
		  spellcastingAbility : 5,
		  spells : ["longstrider"],
		  selection : ["longstrider"],
		  firstCol : 1,
		}],
		spellFirstColTitle : "FP",
		prereqeval : function(v) { return classes.known.monk.level >= 3; },
		spellChanges : {
		  "longstrider" : {
			components : "V,S",
			compMaterial : "",
			allowUpCasting : false,
			changes : "With the Horse Tattoo, I can cast Longstrider without a material component."
		   }
		}
	  },
	  "spider tattoo": {
		name: "Spider Tattoo",
		description: desc([
		  "I know the Mending cantrip. When I hit a creature with an attack granted by my Flurry of Blows, the creature has Disadvantage on its next attack roll before the start of my next turn.",
		]),
		spellcastingBonus : [{
		  name : "Spider Tattoo",
		  spellcastingAbility : 5,
		  spells : ["mending"],
		  selection : ["mending"],
		}],
	  },
	  "tortoise tattoo": {
		name: "Tortoise Tattoo",
		description: desc([
		  "I know the Spare the Dying cantrip. I can expend 1 Focus Point to cast False Life without Material components.",
		]),
		spellcastingBonus : [{
		  name : "Tortoise Tattoo: Spare the Dying",
		  spellcastingAbility : 5,
		  spells : ["spare the dying"],
		  selection : ["spare the dying"],
		}, {
		  name : "Tortoise Tattoo: False Life",
		  spellcastingAbility : 5,
		  spells : ["false life"],
		  selection : ["false life"],
		  firstCol : 1,
		}],
		spellFirstColTitle : "FP",
		prereqeval : function(v) { return classes.known.monk.level >= 3; },
		spellChanges : {
		  "false life" : {
			components : "V,S",
			compMaterial : "",
			allowUpCasting : false,
			changes : "With the Tortoise Tattoo, I can cast False Life without a material component."
		   }
		}
	  },
    },
    "subclassfeature6": {
      name: "Celestial Tattoo",
      source: [["XUA25AS", 4]],
      minlevel: 6,
      description: desc([
        'I gain an additional magic tattoo depicting a celestial phenomenon. Use the "Choose Feature" button above to choose your tattoo.',
      ]),
	  extraname: "Celestial Tattoo",
	  extrachoices: ["Comet Tattoo", "Crescent Moon Tattoo", "Eclipse Tattoo", "Sunburst Tattoo"],
	  extraTimes: [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	  "comet tattoo": {
		name: "Comet Tattoo",
		description: desc([
		  "I can expend 2 Focus Points to cast Find Traps.",
		]),
		spellcastingBonus : [{
		  name : "Comet Tattoo",
		  spellcastingAbility : 5,
		  spells : ["find traps"],
		  selection : ["find traps"],
		  firstCol : 2,
		}],
		spellFirstColTitle : "FP",
	  },
	  "crescent moon tattoo": {
		name: "Crescent Moon Tattoo",
		description: desc([
		  "I can expend 2 Focus Points to cast Misty Step.",
		]),
		spellcastingBonus : [{
		  name : "Crescent Moon Tattoo",
		  spellcastingAbility : 5,
		  spells : ["misty step"],
		  selection : ["misty step"],
		  firstCol : 2,
		}],
		spellFirstColTitle : "FP",
	  },
	  "eclipse tattoo": {
		name: "Eclipse Tattoo",
		description: desc([
		  "I can expend 2 Focus Points to cast Invisibility without Material components.",
		]),
		spellcastingBonus : [{
		  name : "Eclipse Tattoo",
		  spellcastingAbility : 5,
		  spells : ["invisibility"],
		  selection : ["invisibility"],
		  firstCol : 2,
		}],
		spellFirstColTitle : "FP",
		prereqeval : function(v) { return classes.known.monk.level >= 6; },
		spellChanges : {
		  "invisibility" : {
			components : "V,S",
			compMaterial : "",
			allowUpCasting : false,
			changes : "With the Eclipse Tattoo, I can cast Invisibility without a material component."
		   }
		}
	  },
	  "sunburst tattoo": {
		name: "Sunburst Tattoo",
		description: desc([
		  "I can expend 2 Focus Points to cast Lesser Restoration.",
		]),
		spellcastingBonus : [{
		  name : "Sunburst Tattoo",
		  spellcastingAbility : 5,
		  spells : ["lesser restoration"],
		  selection : ["lesser restoration"],
		  firstCol : 2,
		}],
		spellFirstColTitle : "FP",
	  },
    },
	"subclassfeature11": {
      name: "Nature Tattoo",
      source: [["XUA25AS", 5]],
      minlevel: 11,
      description: desc([
        'I gain an additional magic tattoo depicting a natural feature. Use the "Choose Feature" button above to choose your tattoo.',
      ]),
	  extraname: "Nature Tattoo",
	  extrachoices: ["Mountain Tattoo", "Storm Tattoo", "Volcano Tattoo", "Wave Tattoo"],
	  extraTimes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	  "mountain tattoo": {
		name: "Mountain Tattoo",
		description: desc([
		  "As a Magic action, I can expend 3 Focus Points to gain Resistance to Acid damage \u0026 Adv. on Con saves for 1 minute.",
		]),
	  },
	  "storm tattoo": {
		name: "Storm Tattoo",
		description: desc([
		  "As a Magic action, I can expend 3 Focus Points to gain Resistance to Lightning damage \u0026 Adv. on Dex saves for 1 minute.",
		]),
	  },
	  "volcano tattoo": {
		name: "Volcano Tattoo",
		description: desc([
		  "As a Magic action, I can expend 3 Focus Points to gain Resistance to Fire damage \u0026 Adv. on Str saves for 1 minute.",
		]),
	  },
	  "wave tattoo": {
		name: "Wave Tattoo",
		description: desc([
		  "As a Magic action, I can expend 3 Focus Points to gain Resistance to Cold damage \u0026 Adv. on Wis saves for 1 minute.",
		]),
	  },
    },
    "subclassfeature17": {
      name : "Monster Tattoo",
	  source : [["XUA25AS", 5]],
	  minlevel : 17,
	  description : desc([
		'I gain a magic tattoo depicting a supernatural creature. Use the "Choose Feature" button above to choose your tattoo.',
	  ]),
	  extraname: "Monster Tattoo",
	  extrachoices: ["Beholder Tattoo", "Blink Dog Tattoo", "Displacer Beast Tattoo", "Guardian Naga Tattoo"],
	  extraTimes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
	  "beholder tattoo": {
		name: "Beholder Tattoo",
		description: desc([
		  "I have a Fly Speed of 10 feet \u0026 can hover. Additionally, I can expend 3 Focus Points to cast Counterspell.",
		]),
		speed : {
		  fly : { spd : 10, enc : 0 },
		},
		spellcastingBonus : [{
		  name : "Beholder Tattoo",
		  spellcastingAbility : 5,
		  spells : ["counterspell"],
		  selection : ["counterspell"],
		  firstCol : 3,
		}],
		spellFirstColTitle : "FP",
	  },
	  "blink dog tattoo": {
		name: "Blink Dog Tattoo",
		description: desc([
		  "When I expend a Focus Point to use Patient Defense, I can expend 3 Focus Points to cast Blink immediately after that Bonus Action.",
		]),
		spellcastingBonus : [{
		  name : "Blink Dog Tattoo",
		  spellcastingAbility : 5,
		  spells : ["blink"],
		  selection : ["blink"],
		  firstCol : 3,
		}],
		spellFirstColTitle : "FP",
	  },
	  "displacer beast tattoo": {
		name: "Displacer Beast Tattoo",
		description: desc([
		  "When I expend a Focus Point to use Flurry of Blows or Step of the Wind, I can expend 2 Focus Points to cast Mirror Image immediately after that Bonus Action.",
		]),
		spellcastingBonus : [{
		  name : "Displacer Beast Tattoo",
		  spellcastingAbility : 5,
		  spells : ["mirror image"],
		  selection : ["mirror image"],
		  firstCol : 2,
		}],
		spellFirstColTitle : "FP",
	  },
	  "guardian naga tattoo": {
		name: "Guardian Naga Tattoo",
		description: desc([
		  "Once per Long Rest when I would be reduced to 0 HP but not killed outright, my HP instead changes to a number equal to 2x my Monk lvl.",
		]),
	  },
    },
  },
});
/*legacySubClassRefactor("cleric", "arcana", {
  regExpSearch: /^(?=.*(cleric))(?=.*(arcana)).*$/i,
  subname: "Arcana Domain",
  source: [["XUA25AS", 1]],
  replaces: "arcana domain",
  spellcastingExtra: ["detect magic", "magic missile", "magic weapon", "nystul's magic aura", "counterspell", "dispel magic", "arcane eye", "leomund's secret chest", "bigby's hand", "teleportation circle"],
  features: {
    "subclassfeature3": {
      name : "Arcane Initiate",
	  source : [["XUA25AS", 2]],
	  minlevel : 3,
	  description : desc([
		"I gain Expertise with Arcana and two wizard cantrips that count as cleric cantrips",
	  ]),
	  skills : ["Arcana", "full"],
	  spellcastingBonus : [{
		name : "Arcane Initiate",
		"class" : "wizard",
		level : [0, 0],
		times : 2
	  }],
    },
    "subclassfeature3.1": {
      name : "Channel Divinity: Modify Magic",
	  source : [["XUA25AS", 2]],
	  minlevel : 3,
	  description : desc([
		"When I cast a spell, I can expend one use of my Channel Divinity \u0026 change the spell in one of the following ways (no action required).",
		" \u2022 Fortifying Spell. One target of the spell gains a number of Temp HP equal to 2d8 + my Cleric level.",
		" \u2022 Tenacious Spell. When I cast a spell that forces a creature to make a saving throw, choose one target of the spell I can see. Roll 1d6 \u0026 apply the number rolled as a penalty to the target's saving throw."
	  ]),
    },
    "subclassfeature6": {
      name: "Dispelling Recovery",
      source: [["XUA25AS", 2]],
      minlevel: 6,
      description: desc([
        "Immediately after I cast a spell with a spell slot that restores HP to a creature or ends a condition on a creature, I can cast Dispel Magic on the creature as a Bonus Action without expending a spell slot.",
		"I can use this feature a number of times equal to my Wis modifier (minimum of once), \u0026 I regain all expended uses when I finish a Long Rest."
      ]),
	  action : [["bonus action", "Channel Divinity: Dispelling Recovery"]],
	  usages : "Wisdom modifier per ",
	  usagescalc : "event.value = Math.max(1, What('Wis Mod'));",
	  recovery : "long rest",
    },
    "subclassfeature17": {
      name : "Arcane Mastery",
	  source : [["XUA25AS", 2]],
	  minlevel : 17,
	  description : desc([
		"I add four wizards spells, a 6th, 7th, 8th, and 9th-level spell, to my domain spells.",
		"As any domain spell, these spells are automatically prepared and count as cleric spells.",
		"Whenever I gain a Cleric level, I can replace one of these spells with another Wizard spell of the same level.",
	  ]),
	  spellcastingBonus : [{
		name : "Arcane Mastery (6)",
		"class" : "wizard",
		level : [6, 6],
		firstCol : 'markedbox'
	  }, {
		name : "Arcane Mastery (7)",
		"class" : "wizard",
		level : [7, 7],
		firstCol : 'markedbox'
	  }, {
		name : "Arcane Mastery (8)",
		"class" : "wizard",
		level : [8, 8],
		firstCol : 'markedbox'
	  }, {
		name : "Arcane Mastery (9)",
		"class" : "wizard",
		level : [9, 9],
		firstCol : 'markedbox'
	  }],
    },
  },
});
legacySubClassRefactor("cleric", "arcana", {
  regExpSearch: /^(?=.*(cleric))(?=.*(arcana)).*$/i,
  subname: "Arcana Domain",
  source: [["XUA25AS", 1]],
  replaces: "arcana domain",
  spellcastingExtra: ["detect magic", "magic missile", "magic weapon", "nystul's magic aura", "counterspell", "dispel magic", "arcane eye", "leomund's secret chest", "bigby's hand", "teleportation circle"],
  features: {
    "subclassfeature3": {
      name : "Arcane Initiate",
	  source : [["XUA25AS", 2]],
	  minlevel : 3,
	  description : desc([
		"I gain Expertise with Arcana and two wizard cantrips that count as cleric cantrips",
	  ]),
	  skills : ["Arcana", "full"],
	  spellcastingBonus : [{
		name : "Arcane Initiate",
		"class" : "wizard",
		level : [0, 0],
		times : 2
	  }],
    },
    "subclassfeature3.1": {
      name : "Channel Divinity: Modify Magic",
	  source : [["XUA25AS", 2]],
	  minlevel : 3,
	  description : desc([
		"When I cast a spell, I can expend one use of my Channel Divinity \u0026 change the spell in one of the following ways (no action required).",
		" \u2022 Fortifying Spell. One target of the spell gains a number of Temp HP equal to 2d8 + my Cleric level.",
		" \u2022 Tenacious Spell. When I cast a spell that forces a creature to make a saving throw, choose one target of the spell I can see. Roll 1d6 \u0026 apply the number rolled as a penalty to the target's saving throw."
	  ]),
    },
    "subclassfeature6": {
      name: "Dispelling Recovery",
      source: [["XUA25AS", 2]],
      minlevel: 6,
      description: desc([
        "Immediately after I cast a spell with a spell slot that restores HP to a creature or ends a condition on a creature, I can cast Dispel Magic on the creature as a Bonus Action without expending a spell slot.",
		"I can use this feature a number of times equal to my Wis modifier (minimum of once), \u0026 I regain all expended uses when I finish a Long Rest."
      ]),
	  action : [["bonus action", "Channel Divinity: Dispelling Recovery"]],
	  usages : "Wisdom modifier per ",
	  usagescalc : "event.value = Math.max(1, What('Wis Mod'));",
	  recovery : "long rest",
    },
    "subclassfeature17": {
      name : "Arcane Mastery",
	  source : [["XUA25AS", 2]],
	  minlevel : 17,
	  description : desc([
		"I add four wizards spells, a 6th, 7th, 8th, and 9th-level spell, to my domain spells.",
		"As any domain spell, these spells are automatically prepared and count as cleric spells.",
		"Whenever I gain a Cleric level, I can replace one of these spells with another Wizard spell of the same level.",
	  ]),
	  spellcastingBonus : [{
		name : "Arcane Mastery (6)",
		"class" : "wizard",
		level : [6, 6],
		firstCol : 'markedbox'
	  }, {
		name : "Arcane Mastery (7)",
		"class" : "wizard",
		level : [7, 7],
		firstCol : 'markedbox'
	  }, {
		name : "Arcane Mastery (8)",
		"class" : "wizard",
		level : [8, 8],
		firstCol : 'markedbox'
	  }, {
		name : "Arcane Mastery (9)",
		"class" : "wizard",
		level : [9, 9],
		firstCol : 'markedbox'
	  }],
    },
  },
});
legacySubClassRefactor("cleric", "arcana", {
  regExpSearch: /^(?=.*(cleric))(?=.*(arcana)).*$/i,
  subname: "Arcana Domain",
  source: [["XUA25AS", 1]],
  replaces: "arcana domain",
  spellcastingExtra: ["detect magic", "magic missile", "magic weapon", "nystul's magic aura", "counterspell", "dispel magic", "arcane eye", "leomund's secret chest", "bigby's hand", "teleportation circle"],
  features: {
    "subclassfeature3": {
      name : "Arcane Initiate",
	  source : [["XUA25AS", 2]],
	  minlevel : 3,
	  description : desc([
		"I gain Expertise with Arcana and two wizard cantrips that count as cleric cantrips",
	  ]),
	  skills : ["Arcana", "full"],
	  spellcastingBonus : [{
		name : "Arcane Initiate",
		"class" : "wizard",
		level : [0, 0],
		times : 2
	  }],
    },
    "subclassfeature3.1": {
      name : "Channel Divinity: Modify Magic",
	  source : [["XUA25AS", 2]],
	  minlevel : 3,
	  description : desc([
		"When I cast a spell, I can expend one use of my Channel Divinity \u0026 change the spell in one of the following ways (no action required).",
		" \u2022 Fortifying Spell. One target of the spell gains a number of Temp HP equal to 2d8 + my Cleric level.",
		" \u2022 Tenacious Spell. When I cast a spell that forces a creature to make a saving throw, choose one target of the spell I can see. Roll 1d6 \u0026 apply the number rolled as a penalty to the target's saving throw."
	  ]),
    },
    "subclassfeature6": {
      name: "Dispelling Recovery",
      source: [["XUA25AS", 2]],
      minlevel: 6,
      description: desc([
        "Immediately after I cast a spell with a spell slot that restores HP to a creature or ends a condition on a creature, I can cast Dispel Magic on the creature as a Bonus Action without expending a spell slot.",
		"I can use this feature a number of times equal to my Wis modifier (minimum of once), \u0026 I regain all expended uses when I finish a Long Rest."
      ]),
	  action : [["bonus action", "Channel Divinity: Dispelling Recovery"]],
	  usages : "Wisdom modifier per ",
	  usagescalc : "event.value = Math.max(1, What('Wis Mod'));",
	  recovery : "long rest",
    },
    "subclassfeature17": {
      name : "Arcane Mastery",
	  source : [["XUA25AS", 2]],
	  minlevel : 17,
	  description : desc([
		"I add four wizards spells, a 6th, 7th, 8th, and 9th-level spell, to my domain spells.",
		"As any domain spell, these spells are automatically prepared and count as cleric spells.",
		"Whenever I gain a Cleric level, I can replace one of these spells with another Wizard spell of the same level.",
	  ]),
	  spellcastingBonus : [{
		name : "Arcane Mastery (6)",
		"class" : "wizard",
		level : [6, 6],
		firstCol : 'markedbox'
	  }, {
		name : "Arcane Mastery (7)",
		"class" : "wizard",
		level : [7, 7],
		firstCol : 'markedbox'
	  }, {
		name : "Arcane Mastery (8)",
		"class" : "wizard",
		level : [8, 8],
		firstCol : 'markedbox'
	  }, {
		name : "Arcane Mastery (9)",
		"class" : "wizard",
		level : [9, 9],
		firstCol : 'markedbox'
	  }],
    },
  },
});
legacySubClassRefactor("cleric", "arcana", {
  regExpSearch: /^(?=.*(cleric))(?=.*(arcana)).*$/i,
  subname: "Arcana Domain",
  source: [["XUA25AS", 1]],
  replaces: "arcana domain",
  spellcastingExtra: ["detect magic", "magic missile", "magic weapon", "nystul's magic aura", "counterspell", "dispel magic", "arcane eye", "leomund's secret chest", "bigby's hand", "teleportation circle"],
  features: {
    "subclassfeature3": {
      name : "Arcane Initiate",
	  source : [["XUA25AS", 2]],
	  minlevel : 3,
	  description : desc([
		"I gain Expertise with Arcana and two wizard cantrips that count as cleric cantrips",
	  ]),
	  skills : ["Arcana", "full"],
	  spellcastingBonus : [{
		name : "Arcane Initiate",
		"class" : "wizard",
		level : [0, 0],
		times : 2
	  }],
    },
    "subclassfeature3.1": {
      name : "Channel Divinity: Modify Magic",
	  source : [["XUA25AS", 2]],
	  minlevel : 3,
	  description : desc([
		"When I cast a spell, I can expend one use of my Channel Divinity \u0026 change the spell in one of the following ways (no action required).",
		" \u2022 Fortifying Spell. One target of the spell gains a number of Temp HP equal to 2d8 + my Cleric level.",
		" \u2022 Tenacious Spell. When I cast a spell that forces a creature to make a saving throw, choose one target of the spell I can see. Roll 1d6 \u0026 apply the number rolled as a penalty to the target's saving throw."
	  ]),
    },
    "subclassfeature6": {
      name: "Dispelling Recovery",
      source: [["XUA25AS", 2]],
      minlevel: 6,
      description: desc([
        "Immediately after I cast a spell with a spell slot that restores HP to a creature or ends a condition on a creature, I can cast Dispel Magic on the creature as a Bonus Action without expending a spell slot.",
		"I can use this feature a number of times equal to my Wis modifier (minimum of once), \u0026 I regain all expended uses when I finish a Long Rest."
      ]),
	  action : [["bonus action", "Channel Divinity: Dispelling Recovery"]],
	  usages : "Wisdom modifier per ",
	  usagescalc : "event.value = Math.max(1, What('Wis Mod'));",
	  recovery : "long rest",
    },
    "subclassfeature17": {
      name : "Arcane Mastery",
	  source : [["XUA25AS", 2]],
	  minlevel : 17,
	  description : desc([
		"I add four wizards spells, a 6th, 7th, 8th, and 9th-level spell, to my domain spells.",
		"As any domain spell, these spells are automatically prepared and count as cleric spells.",
		"Whenever I gain a Cleric level, I can replace one of these spells with another Wizard spell of the same level.",
	  ]),
	  spellcastingBonus : [{
		name : "Arcane Mastery (6)",
		"class" : "wizard",
		level : [6, 6],
		firstCol : 'markedbox'
	  }, {
		name : "Arcane Mastery (7)",
		"class" : "wizard",
		level : [7, 7],
		firstCol : 'markedbox'
	  }, {
		name : "Arcane Mastery (8)",
		"class" : "wizard",
		level : [8, 8],
		firstCol : 'markedbox'
	  }, {
		name : "Arcane Mastery (9)",
		"class" : "wizard",
		level : [9, 9],
		firstCol : 'markedbox'
	  }],
    },
  },
});
legacySubClassRefactor("cleric", "arcana", {
  regExpSearch: /^(?=.*(cleric))(?=.*(arcana)).*$/i,
  subname: "Arcana Domain",
  source: [["XUA25AS", 1]],
  replaces: "arcana domain",
  spellcastingExtra: ["detect magic", "magic missile", "magic weapon", "nystul's magic aura", "counterspell", "dispel magic", "arcane eye", "leomund's secret chest", "bigby's hand", "teleportation circle"],
  features: {
    "subclassfeature3": {
      name : "Arcane Initiate",
	  source : [["XUA25AS", 2]],
	  minlevel : 3,
	  description : desc([
		"I gain Expertise with Arcana and two wizard cantrips that count as cleric cantrips",
	  ]),
	  skills : ["Arcana", "full"],
	  spellcastingBonus : [{
		name : "Arcane Initiate",
		"class" : "wizard",
		level : [0, 0],
		times : 2
	  }],
    },
    "subclassfeature3.1": {
      name : "Channel Divinity: Modify Magic",
	  source : [["XUA25AS", 2]],
	  minlevel : 3,
	  description : desc([
		"When I cast a spell, I can expend one use of my Channel Divinity \u0026 change the spell in one of the following ways (no action required).",
		" \u2022 Fortifying Spell. One target of the spell gains a number of Temp HP equal to 2d8 + my Cleric level.",
		" \u2022 Tenacious Spell. When I cast a spell that forces a creature to make a saving throw, choose one target of the spell I can see. Roll 1d6 \u0026 apply the number rolled as a penalty to the target's saving throw."
	  ]),
    },
    "subclassfeature6": {
      name: "Dispelling Recovery",
      source: [["XUA25AS", 2]],
      minlevel: 6,
      description: desc([
        "Immediately after I cast a spell with a spell slot that restores HP to a creature or ends a condition on a creature, I can cast Dispel Magic on the creature as a Bonus Action without expending a spell slot.",
		"I can use this feature a number of times equal to my Wis modifier (minimum of once), \u0026 I regain all expended uses when I finish a Long Rest."
      ]),
	  action : [["bonus action", "Channel Divinity: Dispelling Recovery"]],
	  usages : "Wisdom modifier per ",
	  usagescalc : "event.value = Math.max(1, What('Wis Mod'));",
	  recovery : "long rest",
    },
    "subclassfeature17": {
      name : "Arcane Mastery",
	  source : [["XUA25AS", 2]],
	  minlevel : 17,
	  description : desc([
		"I add four wizards spells, a 6th, 7th, 8th, and 9th-level spell, to my domain spells.",
		"As any domain spell, these spells are automatically prepared and count as cleric spells.",
		"Whenever I gain a Cleric level, I can replace one of these spells with another Wizard spell of the same level.",
	  ]),
	  spellcastingBonus : [{
		name : "Arcane Mastery (6)",
		"class" : "wizard",
		level : [6, 6],
		firstCol : 'markedbox'
	  }, {
		name : "Arcane Mastery (7)",
		"class" : "wizard",
		level : [7, 7],
		firstCol : 'markedbox'
	  }, {
		name : "Arcane Mastery (8)",
		"class" : "wizard",
		level : [8, 8],
		firstCol : 'markedbox'
	  }, {
		name : "Arcane Mastery (9)",
		"class" : "wizard",
		level : [9, 9],
		firstCol : 'markedbox'
	  }],
    },
  },
});
legacySubClassRefactor("cleric", "arcana", {
  regExpSearch: /^(?=.*(cleric))(?=.*(arcana)).*$/i,
  subname: "Arcana Domain",
  source: [["XUA25AS", 1]],
  replaces: "arcana domain",
  spellcastingExtra: ["detect magic", "magic missile", "magic weapon", "nystul's magic aura", "counterspell", "dispel magic", "arcane eye", "leomund's secret chest", "bigby's hand", "teleportation circle"],
  features: {
    "subclassfeature3": {
      name : "Arcane Initiate",
	  source : [["XUA25AS", 2]],
	  minlevel : 3,
	  description : desc([
		"I gain Expertise with Arcana and two wizard cantrips that count as cleric cantrips",
	  ]),
	  skills : ["Arcana", "full"],
	  spellcastingBonus : [{
		name : "Arcane Initiate",
		"class" : "wizard",
		level : [0, 0],
		times : 2
	  }],
    },
    "subclassfeature3.1": {
      name : "Channel Divinity: Modify Magic",
	  source : [["XUA25AS", 2]],
	  minlevel : 3,
	  description : desc([
		"When I cast a spell, I can expend one use of my Channel Divinity \u0026 change the spell in one of the following ways (no action required).",
		" \u2022 Fortifying Spell. One target of the spell gains a number of Temp HP equal to 2d8 + my Cleric level.",
		" \u2022 Tenacious Spell. When I cast a spell that forces a creature to make a saving throw, choose one target of the spell I can see. Roll 1d6 \u0026 apply the number rolled as a penalty to the target's saving throw."
	  ]),
    },
    "subclassfeature6": {
      name: "Dispelling Recovery",
      source: [["XUA25AS", 2]],
      minlevel: 6,
      description: desc([
        "Immediately after I cast a spell with a spell slot that restores HP to a creature or ends a condition on a creature, I can cast Dispel Magic on the creature as a Bonus Action without expending a spell slot.",
		"I can use this feature a number of times equal to my Wis modifier (minimum of once), \u0026 I regain all expended uses when I finish a Long Rest."
      ]),
	  action : [["bonus action", "Channel Divinity: Dispelling Recovery"]],
	  usages : "Wisdom modifier per ",
	  usagescalc : "event.value = Math.max(1, What('Wis Mod'));",
	  recovery : "long rest",
    },
    "subclassfeature17": {
      name : "Arcane Mastery",
	  source : [["XUA25AS", 2]],
	  minlevel : 17,
	  description : desc([
		"I add four wizards spells, a 6th, 7th, 8th, and 9th-level spell, to my domain spells.",
		"As any domain spell, these spells are automatically prepared and count as cleric spells.",
		"Whenever I gain a Cleric level, I can replace one of these spells with another Wizard spell of the same level.",
	  ]),
	  spellcastingBonus : [{
		name : "Arcane Mastery (6)",
		"class" : "wizard",
		level : [6, 6],
		firstCol : 'markedbox'
	  }, {
		name : "Arcane Mastery (7)",
		"class" : "wizard",
		level : [7, 7],
		firstCol : 'markedbox'
	  }, {
		name : "Arcane Mastery (8)",
		"class" : "wizard",
		level : [8, 8],
		firstCol : 'markedbox'
	  }, {
		name : "Arcane Mastery (9)",
		"class" : "wizard",
		level : [9, 9],
		firstCol : 'markedbox'
	  }],
    },
  },
});*/