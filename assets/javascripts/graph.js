var getStatusNames = function() {
    var names = [];
    var tbody = document.getElementById('workflow_form').getElementsByTagName('table')[0].getElementsByTagName('tbody')[0];
    var trs = tbody.getElementsByTagName('tr');
    for (var i = 0; i < trs.length; i++) {
        var td = trs[i].getElementsByTagName('td')[0];
        var ems = td.getElementsByTagName('em');
                var text = '';
                if(ems.length != 0){
                        text = ems[0].innerText;
                } else {
                        text = td.innerText;
                }
        names.push(text);
    }

    return names;
}

var setupTransitionStatusEvent = function() {
    tbody = document.getElementById('workflow_form').getElementsByTagName('table')[0].getElementsByTagName('tbody')[0];
    trs = tbody.getElementsByTagName('tr');
    for (var i = 0; i < trs.length; i++) {
        tr = trs[i];
        inputs = tr.getElementsByTagName('input');
        for (var j = 0; j < inputs.length; j++) {
            input = inputs[j];
            if(input.id == '') {
                continue;
            }

            input.addEventListener('change', transitionStatusChanged);
        }
    }
}

var getCheckedItems = function () {
    ret = [];
    tbody = document.getElementById('workflow_form').getElementsByTagName('table')[0].getElementsByTagName('tbody')[0];
    trs = tbody.getElementsByTagName('tr');
    for (var i = 1; i < trs.length; i++) {
        tr = trs[i];
        inputs = tr.getElementsByTagName('input');
        for (var j = 0; j < inputs.length; j++) {
            input = inputs[j];
            if(input.id == '') {
                continue;
            }

            if(input.checked == true) {
                sname = input.id.split('_');
                src = Number(sname[1]);
                dst = Number(sname[2]);
                ret.push([src, dst]);
            }
        }
    }

    return ret;
}

var transitionStatusChanged = function(event) {
    var item = event.target

    var sname = item.id.split('_');
    var src = Number(sname[1]);
    var dst = Number(sname[2]);
    
    var name = 'edge_' + src + '_' + dst;

    if(item.checked == true) {
        cy.add({
            data: {
                id: name,
                source: names[src],
                target: names[dst],
                directed : true
            }
        });
    } else {
        var e = cy.getElementById(name);
        cy.remove(e);
    }


    //var names = getStatusNames();
    //var mtx = getCheckMatrix();
    //updateGraph(names, mtx);
}

var updateGraph = function(names) {
    edges = getCheckedItems();

    cy = cytoscape({
        container: document.getElementById('cy'),
        boxSelectionEnabled: true,
        elements: [],
        style: [{
            selector: 'edge',
            style: {
                'width': '3px',
                'curve-style': 'bezier',
                'target-arrow-shape': 'triangle'
            }
        },
        {
            selector: 'node',
            style: {
                'shape': 'roundrectangle',
                'width': 40,
                'background-color': 'red',
                'label': 'data(id)'
            }
        }]
    });

    for (var i = 0; i < names.length; i++) {
        cy.add({
            data: {
                id: names[i]
            }
        });
    }

    for (var i = 0; i < edges.length; i++) {
        var src = edges[i][0];
        var dst = edges[i][1];
        cy.add({
            data: {
                id: 'edge_' + src + '_' + dst,
                source: names[src],
                target: names[dst],
                directed : true
            }
        });
    }

    layout = cy.layout({
        name: 'cose',
        fit: true,
        directed: true
    });
    layout.run();
}
