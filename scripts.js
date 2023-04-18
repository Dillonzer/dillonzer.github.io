function Set(name, code, ptcgo_code, releaseDate)
{
    this.Name = name;
    this.Code = code;
    this.PTCGO_Code = ptcgo_code;
    this.ReleaseDate = releaseDate;
}

function Chip(name, code, memory, type, damage, image)
{
    this.Name = name;
    this.Code = code;
    this.Memory = memory;
    this.Type = type;
    this.Damage = damage;
    this.Image = image;
}

function FolderChip(name, code, memory, type, damage, count, image)
{
    this.Name = name;
    this.Code = code;
    this.Memory = memory;
    this.Type = type;
    this.Damage = damage;
    this.Count = count;
    this.Image = image;
}


let apiUrl = "https://pkmntcgapi-production.up.railway.app"
let allSets = [];
let chips = [];
let folderChips = [];

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
                            chips.push(new Chip(data[index].name, codes[code], data[index].memory, data[index].element, data[index].damage, data[index].image_URL));
                        }
                        else
                        {                            
                            chips.push(new Chip(data[index].name, codes[code], null, data[index].element, data[index].damage, data[index].image_URL));
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
                        cell2.innerHTML = `${chips[i].Name} ${chips[i].Memory} ${chips[i].Damage}`
                    }
                    else
                    {                        
                        cell2.innerHTML = `${chips[i].Name} ${chips[i].Damage}`
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
    //TODO: Add Logic Restraints for adding chips
    let version = "bn1" //change to dyanmic
    let chipFound = false
    for(let i = 0; i < folderChips.length; i++)
    {
        if(folderChips[i].Name == chip.Name && folderChips[i].Code == chip.Code)
        {
            folderChips[i].Count = 1 + Number(folderChips[i].Count)
            chipFound = true
            break
        }
    }

    if(!chipFound)
    {
        folderChips.push(new FolderChip(chip.Name, chip.Code, chip.Memory, chip.Type, chip.Damage, 1, chip.Image))        
    }  
    
    CreateFolderTable()

}

function CreateFolderTable()
{
    let version = "bn1" //change to dyanmic
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
            cell3.innerHTML = `${folderChips[i].Name} ${folderChips[i].Memory} ${folderChips[i].Damage}`
        }
        else
        {                        
            cell3.innerHTML = `${folderChips[i].Name} ${folderChips[i].Damage}`
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

    CreateFolderTable()
}