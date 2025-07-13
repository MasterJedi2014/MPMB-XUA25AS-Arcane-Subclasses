/*	-INFORMATION-
	Subject:	Subclasses (a.k.a. Archetype)
	Effect:		This script adds the subclasses from XUA25AS.
				This version of the script only adds the Arcana Cleric; Later versions will add the other subclasses from this Unearthed Arcana article. These Subclasses are a transciption of the subclasses found in XUA25AS, transcribed by MasterJedi2014.
	Code by:	MasterJedi2014, using MorePurpleMoreBetter's code as reference
	Date:		2025-07-12 (sheet v13.2.3)
	Notes:		This file will start by shunting the old subclasses into "Legacy" subclasses using code primarily developed by Shroo.
				It will thereafter define the new UA subclasses.
*/

var iFileName = "XUA25AS Content [by MasterJedi2014] V1-1.js";
RequiredSheetVersion("13.2.3");

/*	-SCRIPT AUTHOR NOTE-
	This file should be installed AFTER the other 2024 PHB & DMG scripts made by ThePokésimmer.
*/

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //
// >>> Define Sources for everything first >>> //
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //

SourceList["XUA25EU"] = {
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

// Add Replacement Subclasses
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
	  description : "\n   " + "I gain Expertise with Arcana and two wizard cantrips that count as cleric cantrips",
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
	  description : "\n   " + "I add four wizards spells, a 6th, 7th, 8th, and 9th-level spell, to my domain spells." + "\n   " + "As any domain spell, these spells are automatically prepared and count as cleric spells." + "\n   " + "Whenever I gain a Cleric level, I can replace one of these spells with another Wizard spell of the same level.",
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