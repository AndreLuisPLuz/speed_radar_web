const formatDateTime = (dateTimeString) => {
    const dateObj = new Date(dateTimeString);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const clearTable = () => {
    const table = document.getElementById("violation-tbody");
    while (table.firstChild) {
        table.removeChild(table.lastChild);
    }
};

const fillTable = (violations) => {
    const table = document.getElementById("violation-tbody");
    let isFirstRow = true;

    clearTable();

    violations.forEach(violation => {
        const tr = document.createElement("tr");

        if (isFirstRow) {
            tr.classList = ["first-row"];
        }

        const idTd = document.createElement("td");
        idTd.textContent = violation.id;
        tr.appendChild(idTd);

        const speedTd = document.createElement("td");
        speedTd.textContent = violation.speedKmH + " Km/h";
        tr.appendChild(speedTd);

        const timeTd = document.createElement("td");
        timeTd.textContent = formatDateTime(violation.createdAt);
        tr.appendChild(timeTd);

        isFirstRow = false;
        table.appendChild(tr);
    });
};

const fetchViolations = async() => {
    const options = {
        method: "GET",
        mode: "cors"
    };

    const response = await fetch("http://localhost:3000/violation", options);
    const violations = await response.json();

    return violations;
};

const fetchCheckUpdate = async() => {
    const firstRow = document.getElementsByClassName("first-row")[0];
    const id = firstRow.firstChild.innerHTML;

    const url = new URL("http://localhost:3000/violation/updateCheck");
    const queryParams = {
        latestViolationClientId: id
    };

    url.search = new URLSearchParams(queryParams).toString();

    const options = {
        method: "GET",
        mode: "cors"
    };

    const response = await fetch(
        url,
        options
    );
    const responseJson = await response.json();

    console.log(responseJson.mustFetchAnew);
    return responseJson.mustFetchAnew;
}

const loop = async() => {
    while (true) {
        // const table = document.getElementById("violation-tbody");

        let mustFetchAnew = true;
        // if (table.childElementCount > 0) {
        //     mustFetchAnew = fetchCheckUpdate();
        // }

        if (mustFetchAnew) {
            const violations = await fetchViolations();
            fillTable(violations);
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
    }
};

loop();