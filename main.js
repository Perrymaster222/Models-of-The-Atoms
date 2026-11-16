//Setup
DaltonAtoms = [];
Bonds = [];
BondDistance = 200;
AvailableAtoms = ["Hydrogen", "Helium", "Carbon", "Nitrogen", "Oxygen"];
ValenceLimits = {
    Hydrogen: 1,
    Helium: 0,
    Carbon: 4,
    Nitrogen: 3,
    Oxygen: 2
};
NextUID = 1;
WindowHeight = window.innerHeight;



//Atom Selection Panel
AtomSelectionPanel = document.createElement("div");
AtomSelectionPanel.style.outline = "2px solid gray"
AtomSelectionPanel.style.width = "230px";
AtomSelectionPanel.style.height = "100vh";
AtomSelectionPanel.style.display = "flex";
AtomSelectionPanel.style.alignContent = "flex-start";
AtomSelectionPanel.style.flexWrap = "wrap";
AtomSelectionPanel.style.rowGap = "10px";
AtomSelectionPanel.style.columnGap = "10px";
document.body.append(AtomSelectionPanel);

for (let Element of AvailableAtoms) {
    let AtomDiv = document.createElement("div");
    AtomDiv.style.outline = "2px solid gray"
    AtomDiv.style.width = "100px";
    AtomDiv.style.height = "100px";
    AtomDiv.style.left = "10px";
    AtomDiv.style.position = "relative";
    AtomSelectionPanel.append(AtomDiv);

    let AtomImage = document.createElement("img");
    AtomImage.src = "Assets/"+Element+".png";
    AtomImage.style.width = "80px";
    AtomImage.style.height = "80px";
    AtomImage.style.left = "10px";
    AtomImage.style.top = "10px";
    AtomImage.style.position = "relative";
    AtomImage.addEventListener("click", () => {
        CreateAtom(Element);
    });
    AtomDiv.append(AtomImage);

    let Atom = 0;
};



//Board
Board = document.createElement("div");
Board.style.height = "100vh";
Board.style.display = "flex";
Board.style.alignContent = "flex-start";
Board.style.flexWrap = "wrap";
Board.style.rowGap = "10px";
Board.style.columnGap = "10px";
document.body.append(Board);



//Create Atoms
function CreateAtom(Element) {
    if (AvailableAtoms.includes(Element)) {
        let Atom = document.createElement("img");
        Atom.Element = Element
        Atom.src = "Assets/"+Element+".png";
        Atom.style.position = "absolute";
        Atom.style.left = "300px";
        Atom.style.top = "100px";
        Atom.style.cursor = "grab";
        Atom.style.imageRendering = "pixelated";
        Atom.UID = NextUID++;
        Board.append(Atom);
        
        EnableDragging(Atom);
        Atom.Bonds = [];
        DaltonAtoms.push(Atom);
        return Atom;
    } else {
        console.log("Element not Available")
    }
};



//Enable Dragging
function EnableDragging(Atom) {
    let IsDragging = false;
    let OffsetX = 0;
    let OffsetY = 0;

    const OnMove = (MoveEvent) => {
        if (!IsDragging) return;
        Atom.style.left = MoveEvent.clientX - OffsetX+"px";
        Atom.style.top = MoveEvent.clientY - OffsetY+"px";
        
        UpdateBondPositions();
    };

    Atom.addEventListener("pointerdown", (Event) => {
        if (!IsDragging) {
            IsDragging = true;
            Atom.style.cursor = "grabbing";
            Atom.style.zIndex = "100";
            OffsetX = Event.clientX - Atom.offsetLeft;
            OffsetY = Event.clientY - Atom.offsetTop;
            window.addEventListener("pointermove", OnMove);
        } else {
            IsDragging = false;
            Atom.style.cursor = "grab";
            Atom.style.zIndex = "1";
            window.removeEventListener("pointermove", OnMove);
            CheckForBonds(Atom);
        }
    });
}



function CheckForBonds(AtomA) {
    let CenterA = {
        X: AtomA.offsetLeft + (AtomA.offsetWidth / 2),
        Y: AtomA.offsetTop + (AtomA.offsetHeight / 2)
    };
    
    for(let AtomB of DaltonAtoms) {
        if (AtomA === AtomB) {
            continue;
        };
        
        let CenterB = {
            X: AtomB.offsetLeft + (AtomB.offsetWidth / 2),
            Y: AtomB.offsetTop + (AtomB.offsetHeight / 2)
        };

        let XDistance = CenterB.X - CenterA.X;
        let YDistance = CenterB.Y - CenterA.Y;
        let Distance = Math.hypot(XDistance, YDistance);

        if (Distance <=BondDistance) {
            CreateBond(AtomA, AtomB);
        };
    };
};



//Bonding
function CreateBond(AtomA, AtomB) {
    if (AtomA.Bonds.includes(AtomB) || AtomB.Bonds.includes(AtomA)) {
        return;
    };

    if (AtomA.Bonds.length >= ValenceLimits[AtomA.Element] || AtomB.Bonds.length >= ValenceLimits[AtomB.Element]) {
        return;
    };
    AtomA.Bonds.push(AtomB);
    AtomB.Bonds.push(AtomA);

    const BondLine = document.createElement("div");
    BondLine.style.position = "absolute";
    BondLine.style.height = "6px";
    BondLine.style.backgroundColor = "#000000";
    BondLine.style.borderRadius = "3px";
    BondLine.style.transformOrigin = "0 50%";
    BondLine.style.pointerEvents = "none";
    BondLine.style.zIndex = "0";
    document.body.append(BondLine);

    Bonds.push({AtomA, AtomB, BondLine});
    UpdateBondPositions();
};



//Update Bond Positions
function UpdateBondPositions() {
    for (let Bond of Bonds) {
        let CenterA = {
            X: Bond.AtomA.offsetLeft + (Bond.AtomA.offsetWidth / 2),
            Y: Bond.AtomA.offsetTop + (Bond.AtomA.offsetHeight / 2)
        };
        let CenterB = {
            X: Bond.AtomB.offsetLeft + (Bond.AtomB.offsetWidth / 2),
            Y: Bond.AtomB.offsetTop + (Bond.AtomB.offsetHeight / 2)
        };

        let XDistance = CenterB.X - CenterA.X;
        let YDistance = CenterB.Y - CenterA.Y;
        let Distance = Math.hypot(XDistance, YDistance);
        const Angle = Math.atan2(YDistance, XDistance) * (180 / Math.PI);

        Bond.BondLine.style.left = CenterA.X + "px";
        Bond.BondLine.style.top = (CenterA.Y - 3) + "px";
        Bond.BondLine.style.width = Distance + "px";
        Bond.BondLine.style.transform = "rotate("+Angle+"deg)";
    }
};