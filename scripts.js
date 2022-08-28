function Set(name, code, ptcgo_code, releaseDate)
{
    this.Name = name;
    this.Code = code;
    this.PTCGO_Code = ptcgo_code;
    this.ReleaseDate = releaseDate;
}


let apiUrl = "https://pkmntcgapi-production.up.railway.app"
let allSets = [];

function loadSetTable()
{
    GetAllSets()
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
