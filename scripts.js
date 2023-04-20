function Set(name, code, ptcgo_code, releaseDate)
{
    this.Name = name;
    this.Code = code;
    this.PTCGO_Code = ptcgo_code;
    this.ReleaseDate = releaseDate;
}

function Chip(name, code, memory, type, damage, image, category, locations)
{
    this.Name = name;
    this.Code = code;
    this.Memory = memory;
    this.Type = type;
    this.Damage = damage;
    this.Image = image;
    this.Category = category;
    this.Locations = locations;
}

function FolderChip(name, code, memory, type, damage, count, image, category, location)
{
    this.Name = name;
    this.Code = code;
    this.Memory = memory;
    this.Type = type;
    this.Damage = damage;
    this.Count = count;
    this.Image = image;
    this.Category = category;
    this.Location = location;
}


let apiUrl = "https://pkmntcgapi-production.up.railway.app"
let allSets = [];
let chips = [];
let folderChips = [];
let folderCountDic = [];

function loadSetTable()
{
    GetAllSets()
}

function initChipFolder()
{
    GetAllChipsForTable("bn1")
}

function GetAllSets()
{
    var apiCall = apiUrl+"/api/sets";
            fetch(apiCall).then(response => {
            return response.json();
            }).then(data => {
                for(index in data) {
                    allSets.push(new Set(data[index].name, data[index].code, data[index].ptcgoCode, data[index].releaseDate));
                }

                let setViewTable = document.getElementById("ptcgBotSets");
                setViewTable.innerHTML = ""
                for(let i = 0; i < allSets.length; i++)
                {
                    var rowCount = setViewTable.rows.length;
                    var newRow = setViewTable.insertRow(rowCount);
                    var cell1 = newRow.insertCell(0);
                    var cell2 = newRow.insertCell(1);
                    cell1.innerHTML = allSets[i].Name
                    cell2.innerHTML = allSets[i].PTCGO_Code
                }       
                var row = setViewTable.insertRow(0); 
                var head1 = row.insertCell(0);
                var head2 = row.insertCell(1);
                head1.outerHTML = "<th>Set Name</th>"
                head2.outerHTML = "<th>Set Abbreviation</th>"
                
            }).catch(err => {
                console.log(err)
            });
}

function ReloadChips()
{
    let filter_chipName = document.getElementById("search_chipName")
    let filter_chipCode = document.getElementById("search_chipCode")
    filter_chipName.value=""
    filter_chipCode.value = ""
    chips = []
    folderChips = []
    folderCountDic = []
    let folderHead = document.getElementById("folderHeader");
    folderHead.innerHTML = "Folder: 0 Chips" 
    CreateFolderTable()
    var version = document.getElementById("gameVersion").value
    GetAllChipsForTable(version)
}

function GetAllChipsForTable(version)
{
    var apiCall = apiUrl+"/mmbn/"+version;
            fetch(apiCall).then(response => {
            return response.json();
            }).then(data => {
                for(index in data) {
                    var codes = data[index].codes.split(',');
                    for(code in codes)
                    {
                        if(version != "bn1")
                        {                            
                            chips.push(new Chip(data[index].name, codes[code], data[index].memory, data[index].element, data[index].damage, data[index].image_URL, data[index].category, data[index].locations));
                        }
                        else
                        {                            
                            chips.push(new Chip(data[index].name, codes[code], null, data[index].element, data[index].damage, data[index].image_URL, data[index].category, data[index].locations));
                        }
                    }
                }

                let chipViewTable = document.getElementById("chipTable");
                chipViewTable.innerHTML = ""
                for(let i = 0; i < chips.length; i++)
                {
                    var rowCount = chipViewTable.rows.length;
                    var newRow = chipViewTable.insertRow(rowCount);
                    newRow.onclick = function () {MoveChipToFolder(chips[i])}
                    var img = document.createElement('img');
                    var typeImg = GetTypeUrl(chips[i].Type)
                    img.src = typeImg;
                    img.style.width = "25px"
                    img.style.height = "25px"
                    var cell1 = newRow.insertCell(0);
                    var cell2 = newRow.insertCell(1);
                    var cell3 = newRow.insertCell(2);
                    cell1.innerHTML = chips[i].Code
                    if(version != "bn1")
                    {
                        cell2.innerHTML = `${chips[i].Name} [${chips[i].Memory} MB] (${chips[i].Damage})`
                    }
                    else
                    {                        
                        cell2.innerHTML = `${chips[i].Name} (${chips[i].Damage})`
                    }
                    cell2.style.backgroundImage=`url(${chips[i].Image})`
                    cell3.appendChild(img);
                    cell2.classList.add('chipSpan')
                    cell1.classList.add('folderCount')
                }       
                
            }).catch(err => {
                console.log(err)
            });
}

function GetTypeUrl(type)
{
    switch(type)
    {
        case "None":
            return "https://pkmn-tcg-api-images.sfo2.cdn.digitaloceanspaces.com/!Logos/None.png"
        case "Aqua":
            return "https://pkmn-tcg-api-images.sfo2.cdn.digitaloceanspaces.com/!Logos/Aqua.png"            
        case "Break":
            return "https://pkmn-tcg-api-images.sfo2.cdn.digitaloceanspaces.com/!Logos/Break.png"            
        case "Cursor":
            return "https://pkmn-tcg-api-images.sfo2.cdn.digitaloceanspaces.com/!Logos/Cursor.png"
        case "Obstacle":
            return "https://pkmn-tcg-api-images.sfo2.cdn.digitaloceanspaces.com/!Logos/Obstacle.png"
        case "Elec":
            return "https://pkmn-tcg-api-images.sfo2.cdn.digitaloceanspaces.com/!Logos/Elec.png"
        case "Recovery":
            return "https://pkmn-tcg-api-images.sfo2.cdn.digitaloceanspaces.com/!Logos/Recovery.png"
        case "Sword":
            return "https://pkmn-tcg-api-images.sfo2.cdn.digitaloceanspaces.com/!Logos/Sword.png"
        case "Wind":
            return "https://pkmn-tcg-api-images.sfo2.cdn.digitaloceanspaces.com/!Logos/Wind.png"
        case "Plus":
            return "https://pkmn-tcg-api-images.sfo2.cdn.digitaloceanspaces.com/!Logos/Plus.png"
        case "Wood":
            return "https://pkmn-tcg-api-images.sfo2.cdn.digitaloceanspaces.com/!Logos/Wood.png"
        case "Invisible":
            return "https://pkmn-tcg-api-images.sfo2.cdn.digitaloceanspaces.com/!Logos/Invisible.png"
        case "Panel Destruction":
            return "https://pkmn-tcg-api-images.sfo2.cdn.digitaloceanspaces.com/!Logos/Panel%20Destruction.png"
        case "Fire":
            return "https://pkmn-tcg-api-images.sfo2.cdn.digitaloceanspaces.com/!Logos/Fire.png"
    }
}

function MoveChipToFolder(chip)
{
    let version = document.getElementById("gameVersion").value
    let megaCount = 0
    let gigaCount = 0
    let folderCount = 0

    for(let i = 0; i < folderCountDic.length; i++)
    {
        if(folderCountDic[i].ChipName == chip.Name)
        {
            switch(version)
            {
                case "bn1":
                {
                    if(folderCountDic[i].Count == 10)
                    {
                        alert("Cannot have more than 10 copies of this chip")
                        return 
                    }
                    break
                }
                case "bn2":
                {
                    if(folderCountDic[i].Count == 5)
                    {
                        alert("Cannot have more than 5 copies of this chip")
                        return 
                    }    
                    break            
                }
                case "bn3":
                {
                    if(folderCountDic[i].Count == 4)
                    {
                        alert("Cannot have more than 4 copies of this chip")
                        return 
                    }
                    
                    if((folderCountDic[i].Category == "Mega" || folderCountDic[i].Category == "Giga") && folderCountDic[i].Count == 1)
                    {
                        alert("Cannot have more than 1 of these chips")
                        return
                    }
                    break                
                }
                case "bn4":
                {
                    if(folderCountDic[i].Count == 4)
                    {
                        alert("Cannot have more than 4 copies of this chip")
                        return 
                    }
                    
                    if((folderCountDic[i].Category == "Mega" || folderCountDic[i].Category == "Giga") && folderCountDic[i].Count == 1)
                    {
                        alert("Cannot have more than 1 of these chips")
                        return
                    }  
                    break                   
                }
                case "bn5":
                {
                    if(folderCountDic[i].Count == 4)
                    {
                        alert("Cannot have more than 4 copies of this chip")
                        return 
                    }  
                    
                    if((folderCountDic[i].Category == "Mega" || folderCountDic[i].Category == "Giga") && folderCountDic[i].Count == 1)
                    {
                        alert("Cannot have more than 1 of these chips")
                        return
                    }
                    break                   
                }
                case "bn6":
                {

                    if(folderCountDic[i].Memory <= 19)
                    {
                        if(folderCountDic[i].Count == 5)
                        {                            
                            alert("Cannot have more than 5 copies of this chip")
                            return
                        }
                    }
                    else if(folderCountDic[i].Memory <= 29)
                    {
                        if(folderCountDic[i].Count == 4)
                        {                            
                            alert("Cannot have more than 4 copies of this chip")
                            return
                        }
                    }
                    else if(folderCountDic[i].Memory <= 39)
                    {
                        if(folderCountDic[i].Count ==  3)
                        {                            
                            alert("Cannot have more than 3 copies of this chip")
                            return
                        }
                    }
                    else if(folderCountDic[i].Memory <= 49)
                    {
                        if(folderCountDic[i].Count == 2)
                        {                            
                            alert("Cannot have more than 2 copies of this chip")
                            return
                        }
                    }
                    else if(folderCountDic[i].Memory > 50)
                    {
                        if(folderCountDic[i].Count == 1)
                        {                            
                            alert("Cannot have more than 1 copies of this chip")
                            return
                        }
                    }

                    break
                }
            }
        }
    }  

    for(let i = 0; i < folderChips.length; i++)
    {
        folderCount = folderCount + folderChips[i].Count

        if(folderChips[i].Category == "Mega")
        {
            megaCount = megaCount + 1
        }

        if(folderChips[i].Category == "Giga")
        {
            gigaCount = gigaCount + 1
        }

    }
    
    if(folderCount == 30)
    {
        alert("Max Folder Size Reached")
        return
    }

    if(chip.Category == "Mega" && megaCount == 7)
    {
        alert("You have the max amount of Mega chips in this Folder")
        return
    }

    if(chip.Category == "Giga" && gigaCount == 2)
    {
        alert("You have the max amount of Giga chips in this Folder")
        return
    }

    let chipFound = false
    let chipCountFound = false
    for(let i = 0; i < folderChips.length; i++)
    {
        if(!chipCountFound)
        {
            if(folderChips[i].Name == chip.Name)
            {
                chipCountFound = true
                for(let j = 0; j < folderCountDic.length; j++)
                {
                    if(folderCountDic[j].ChipName == chip.Name)
                    {
                        folderCountDic[j].Count = Number(folderCountDic[j].Count) + 1
                        break
                    }
                }
            }
        }

        if(folderChips[i].Name == chip.Name && folderChips[i].Code == chip.Code)
        {
            folderChips[i].Count = 1 + Number(folderChips[i].Count)
            chipFound = true
            break
        }
    }

    if(!chipFound)
    {
        let splitLocation = chip.Locations.split("\n")
        let location = "Unknown"
        for(let i = 0; i < splitLocation.length; i++)
        {
            if(splitLocation[i].toLowerCase().startsWith(`${chip.Code.toLowerCase()}:`))
            {
                location = splitLocation[i].substring(2)
                break;
            }
        }
        folderChips.push(new FolderChip(chip.Name, chip.Code, chip.Memory, chip.Type, chip.Damage, 1, chip.Image, chip.Category, location))      
        if(!chipCountFound)
        {
            folderCountDic.push({
                ChipName: chip.Name,
                Count: 1,
                Memory: chip.Memory,
                Category: chip.Category
            })
        }
    }  
    let stringFolderSize = folderCount + 1
    let folderHead = document.getElementById("folderHeader");
    folderHead.innerHTML = "Folder: " + stringFolderSize + " Chips" 
    
    CreateFolderTable()

}

function CreateFolderTable()
{
    let version = document.getElementById("gameVersion").value
    let folderChipTable = document.getElementById("folderChipTable");
    folderChipTable.innerHTML = ""
    for(let i = 0; i < folderChips.length; i++)
    {
        var rowCount = folderChipTable.rows.length;
        var newRow = folderChipTable.insertRow(rowCount);
        newRow.oncontextmenu = function () {RemoveChip(folderChips[i])}
        var img = document.createElement('img');
        var typeImg = GetTypeUrl(folderChips[i].Type)
        img.src = typeImg;
        img.style.width = "25px"
        img.style.height = "25px"
        var cell1 = newRow.insertCell(0);
        var cell2 = newRow.insertCell(1);
        var cell3 = newRow.insertCell(2);
        var cell4 = newRow.insertCell(3);
        cell2.innerHTML = folderChips[i].Code
        if(version != "bn1")
        {
            cell3.innerHTML = `${folderChips[i].Name} [${folderChips[i].Memory} MB] (${folderChips[i].Damage})`
        }
        else
        {                        
            cell3.innerHTML = `${folderChips[i].Name} (${folderChips[i].Damage})`
        }
        cell3.style.backgroundImage=`url(${folderChips[i].Image})`
        cell4.appendChild(img);
        cell3.classList.add('folderSpan')
        cell2.classList.add('folderCount')
        cell1.classList.add('folderCount')
        cell1.innerHTML = folderChips[i].Count
    }
}

function RemoveChip(chip)
{
    for(let i = 0; i < folderChips.length; i++)
    {
        if(folderChips[i].Name == chip.Name && folderChips[i].Code == chip.Code)
        {
            if(folderChips[i].Count >= 1)
            {
            folderChips[i].Count = Number(folderChips[i].Count) - 1
            }

            if(folderChips[i].Count == 0)
            {
                folderChips.splice(i,1)
            }

            break
        }
    }

    for(let i = 0; i < folderCountDic.length; i++)
    {
        if(folderCountDic[i].ChipName == chip.Name)
        {
            if(folderCountDic[i].Count >= 1)
            {
                folderCountDic[i].Count = Number(folderCountDic[i].Count) - 1
            }

            if(folderCountDic[i].Count == 0)
            {
                folderCountDic.splice(i,1)
            }

            break
        }
    }
    let folderCount = 0
    for(let i = 0; i < folderChips.length; i++)
    {
        folderCount = folderCount + folderChips[i].Count

    }
    
    let folderHead = document.getElementById("folderHeader");
    folderHead.innerHTML = "Folder: " + folderCount + " Chips" 

    CreateFolderTable()
}

function ExportFolder()
{   
    let includeLocations = document.getElementById("exportLocations").checked
    let folderCopy = "## Megaman Battle Network Folder Export ##\n"     
    let version = document.getElementById("gameVersion")
    let verText = version.options[version.selectedIndex].text;
    folderCopy += "## Game: " + verText + " ##\n"
    let folderCount = 0

    for(let i = 0; i < folderChips.length; i++)
    {
        folderCount = folderCount + folderChips[i].Count
        if(verText != "Battle Network 1")
        {
            if(includeLocations)
            {
                folderCopy += `- (${folderChips[i].Count}) ${folderChips[i].Name} [${folderChips[i].Code}] [${folderChips[i].Memory} MB] >> Location:${folderChips[i].Location}\n`
            }
            else
            {                
                folderCopy += `- (${folderChips[i].Count}) ${folderChips[i].Name} [${folderChips[i].Code}] [${folderChips[i].Memory} MB]\n`
            }
        }
        else
        {
            if(includeLocations)
            {
                folderCopy += `- (${folderChips[i].Count}) ${folderChips[i].Name} [${folderChips[i].Code}] >> Location:${folderChips[i].Location}\n`
            }
            else
            {                
                folderCopy += `- (${folderChips[i].Count}) ${folderChips[i].Name} [${folderChips[i].Code}]\n`
            }

        }
    }

    folderCopy += "## Folder Count: " + folderCount + " ##\n"
    folderCopy += "## Created via https://dillonzer.github.io/folder_crafter.html ##"

    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = folderCopy;
    dummy.select();
    navigator.clipboard.writeText(folderCopy);
    //change to copied
    document.body.removeChild(dummy);

    alert("Folder copied to clipboard!")
}

function ImportFolder()
{
    let folderImport = document.getElementById("importChipFile").value
    let splitImport = folderImport.split('\n')
    let version = ""
    let versionData = 0
    let chipsLoaded = false  
    let versionElement = document.getElementById("gameVersion")
    let filter_chipName = document.getElementById("search_chipName")
    let filter_chipCode = document.getElementById("search_chipCode")
    filter_chipName.text = ""
    filter_chipCode.text = ""

    for(let i = 0; i < splitImport.length; i++)
    {
        if(splitImport[i].startsWith("##") && !splitImport[i].startsWith("## Game:"))
        {continue;}

        if(splitImport[i].startsWith("## Game:"))
        {
            versionData = splitImport[i].split(' ')
            version = "bn" + versionData[4]
            continue
        }

        if(!chipsLoaded)
        {
            versionElement.selectedIndex=versionData[4]-1
            ReloadChipsForImport(splitImport)
            break
        }        
    }
}

function ReloadChipsForImport(splitImport)
{
    let filter_chipName = document.getElementById("search_chipName")
    let filter_chipCode = document.getElementById("search_chipCode")
    filter_chipName.value=""
    filter_chipCode.value = ""
    chips = []
    folderChips = []
    folderCountDic = []
    let folderHead = document.getElementById("folderHeader");
    folderHead.innerHTML = "Folder: 0 Chips"
    var version = document.getElementById("gameVersion").value
    GetAllChipsForTableForImport(version, splitImport)
}

function GetAllChipsForTableForImport(version, splitImport)
{
    var apiCall = apiUrl+"/mmbn/"+version;
            fetch(apiCall).then(response => {
            return response.json();
            }).then(data => {
                for(index in data) {
                    var codes = data[index].codes.split(',');
                    for(code in codes)
                    {
                        if(version != "bn1")
                        {                            
                            chips.push(new Chip(data[index].name, codes[code], data[index].memory, data[index].element, data[index].damage, data[index].image_URL, data[index].category, data[index].locations));
                        }
                        else
                        {                            
                            chips.push(new Chip(data[index].name, codes[code], null, data[index].element, data[index].damage, data[index].image_URL, data[index].category, data[index].locations));
                        }
                    }
                }

                let chipViewTable = document.getElementById("chipTable");
                chipViewTable.innerHTML = ""
                for(let i = 0; i < chips.length; i++)
                {
                    var rowCount = chipViewTable.rows.length;
                    var newRow = chipViewTable.insertRow(rowCount);
                    newRow.onclick = function () {MoveChipToFolder(chips[i])}
                    var img = document.createElement('img');
                    var typeImg = GetTypeUrl(chips[i].Type)
                    img.src = typeImg;
                    img.style.width = "25px"
                    img.style.height = "25px"
                    var cell1 = newRow.insertCell(0);
                    var cell2 = newRow.insertCell(1);
                    var cell3 = newRow.insertCell(2);
                    cell1.innerHTML = chips[i].Code
                    if(version != "bn1")
                    {
                        cell2.innerHTML = `${chips[i].Name} [${chips[i].Memory} MB] (${chips[i].Damage})`
                    }
                    else
                    {                        
                        cell2.innerHTML = `${chips[i].Name} (${chips[i].Damage})`
                    }
                    cell2.style.backgroundImage=`url(${chips[i].Image})`
                    cell3.appendChild(img);
                    cell2.classList.add('chipSpan')
                    cell1.classList.add('folderCount')
                }   

                for(let i = 0; i < splitImport.length; i++)
                {
                    if(splitImport[i].startsWith("##"))
                    {continue;}

                    let chipData = splitImport[i].split(' ')
                    let chipAmount = chipData[1].replace("(","")
                    chipAmount = chipAmount.replace(")","")

                    let chipName = chipData[2]
                    let chipCode = chipData[3].replace("[","")
                    chipCode = chipCode.replace("]","")

                    for(let j = 0; j < chips.length; j++)
                    {
                        if(chipName == chips[j].Name && chipCode == chips[j].Code)
                        {            
                            for(let k = 0; k < chipAmount; k++)
                            {
                                MoveChipToFolder(chips[j])
                            }    
                            break
                        }
                    }
                }
                
                CreateFolderTable()
                
            }).catch(err => {
                console.log(err)
            });
}

function FilterChips()
{
    let filter_chipName = document.getElementById("search_chipName").value
    let filter_chipCode = document.getElementById("search_chipCode").value
    let splitChips = []
    if(filter_chipCode != undefined)
    {
        splitChips = filter_chipCode.split(",")
    }

    for(let i = 0; i < splitChips.length; i++)
    {
        splitChips[i] = splitChips[i].trim();
    }

    let filteredChips = []

    if((filter_chipName == undefined || filter_chipName == "") && (filter_chipCode == undefined || filter_chipCode == ""))
    {
        filteredChips = chips
    }
    
    if(filter_chipName != undefined && filter_chipName != "" && (filter_chipCode == undefined || filter_chipCode == ""))
    {
        for(let i = 0; i < chips.length; i++)
        {
            if(chips[i].Name.toLowerCase().includes(filter_chipName.toLowerCase()))
            {
                filteredChips.push(chips[i])
            }
        }
    }
    
    if(filter_chipCode != undefined && filter_chipCode != "" && (filter_chipName == undefined || filter_chipName == ""))
    {
        for(let i = 0; i < chips.length; i++)
        {
            for(let j = 0; j < splitChips.length; j++)
            {
                if(chips[i].Code.toLowerCase().includes(splitChips[j].toLowerCase()))
                {
                    filteredChips.push(chips[i])
                }
            }
        }
    }

    if(filter_chipCode != undefined && filter_chipCode != "" && filter_chipName != undefined && filter_chipName != "")
    {
        for(let i = 0; i < chips.length; i++)
        {
            if(chips[i].Name.toLowerCase().includes(filter_chipName.toLowerCase()))
            {
                for(let j = 0; j < splitChips.length; j++)
                {
                    if(chips[i].Code.toLowerCase().includes(splitChips[j].toLowerCase()))
                    {
                        filteredChips.push(chips[i])
                    }
                }
            }
        }
    }

    GetFilteredChipsForTable(filteredChips)

}

function GetFilteredChipsForTable(filteredChips)
{  
    let version = document.getElementById("gameVersion").value
    let chipViewTable = document.getElementById("chipTable");
    chipViewTable.innerHTML = ""
    for(let i = 0; i < filteredChips.length; i++)
    {
        var rowCount = chipViewTable.rows.length;
        var newRow = chipViewTable.insertRow(rowCount);
        newRow.onclick = function () {MoveChipToFolder(filteredChips[i])}
        var img = document.createElement('img');
        var typeImg = GetTypeUrl(filteredChips[i].Type)
        img.src = typeImg;
        img.style.width = "25px"
        img.style.height = "25px"
        var cell1 = newRow.insertCell(0);
        var cell2 = newRow.insertCell(1);
        var cell3 = newRow.insertCell(2);
        cell1.innerHTML = filteredChips[i].Code
        if(version != "bn1")
        {
            cell2.innerHTML = `${filteredChips[i].Name} [${filteredChips[i].Memory} MB] (${filteredChips[i].Damage})`
        }
        else
        {                        
            cell2.innerHTML = `${filteredChips[i].Name} (${filteredChips[i].Damage})`
        }
        cell2.style.backgroundImage=`url(${filteredChips[i].Image})`
        cell3.appendChild(img);
        cell2.classList.add('chipSpan')
        cell1.classList.add('folderCount')
    }               
}