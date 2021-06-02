const app = Vue.createApp({
    data(){
        return { 
            /* Datos Tablas */
            miembros: [],
            partidoR: [],
            partidoD: [],
            partidoID: [],
            mostEnganged: [],
            leastEnganged:[],
            mostLoyalty:[],
            leastLoyalty:[],
            /* Estados */
            states:[],
            /* Boton Read More - Read Less */
            read: "Read More",
            isShow: true,
            /* Checkbox - Select */
            checkboxes: [],
            selected: "All",
        }
    },
    created(){
        let url = "https://api.propublica.org/congress/v1/113/house/members.json"
        let init={
            method: "GET",
            headers: {
                "X-API-Key":"eexrqveyxeppR7sxXHvRE2eEmCqg8snJrLoAuAju"
            }
        }
        if(document.title.includes("Senate")) {
            url = "https://api.propublica.org/congress/v1/113/senate/members.json"
        } 
        fetch(url, init)
        .then(response => response.json())
        .then(data => {
            this.miembros = data.results[0].members
            this.mostEnganged = this.diezPct(this.ordenar(this.miembros, "missed_votes_pct", true), "missed_votes_pct")
            this.leastEnganged = this.diezPct(this.ordenar(this.miembros, "missed_votes_pct", false), "missed_votes_pct")
            this.mostLoyalty = this.diezPct(this.ordenar(this.miembros, "votes_with_party_pct", false), "votes_with_party_pct")
            this.leastLoyalty = this.diezPct(this.ordenar(this.miembros, "votes_with_party_pct", true), "votes_with_party_pct")
            this.miembrosPartidos()
        })
        .catch(err => alert(err.message));
    },
    methods:{
        toggleShow() {
            this.isShow = !this.isShow
            this.isShow ? this.read = "Read More" : this.read = "Read Less"
        },
        ordenar(array,prop,esAscendente) {
            let copiaArr = [...array]
            copiaArr.sort((a, b) => {
                if (a[prop] < b[prop]) {
                    if (esAscendente) {
                        return -1
                    } else {
                        return 1
                    }
                }
                if (a[prop] > b[prop]) {
                    if (esAscendente) {
                        return 1
                    } else {
                        return -1
                    }

                }
                return 0
            })
            return copiaArr
        },
        diezPct(array, prop) {
            let posicion = parseInt(array.length * .1)
            let arrReducido = array.splice(0, posicion + 1)
            let ultimoValor = arrReducido[arrReducido.length - 1][prop]
            array.forEach(element => {
                if (element[prop] > 0) {
                    if (element[prop] === ultimoValor) {
                            arrReducido.push(element)
                    }
                }
            })
            return arrReducido
        },
        miembrosPartidos(){
            this.partidoR = this.miembros.filter(miembro =>miembro.party === "R")
            this.partidoD = this.miembros.filter(miembro => miembro.party === "D") 
            this.partidoID = this.miembros.filter(miembro => miembro.party === "ID")
        },
    },
    computed:{
        estados() {
            this.miembros.forEach(member => {
                if (!this.states.includes(member.state)) {
                    this.states.push(member.state)
                }
            })
            return this.states.sort()
        },
        memberFiltrados(){
            let check = this.miembros.filter(member => this.checkboxes.includes(member.party) || this.checkboxes.length === 0); 
            if(this.selected === "All") {
                return check;
            } else {
                return check.filter(member => member.state === this.selected)
            }
        },
        statesFilter(){
            this.states = this.miembros.filter(miembro => miembro.state)
        },
        //necesito me recorra el array del partido
        //me sume los porcentajes de votos y los divida por la cantidad de miembros del partido
        sumVotesR(){
            let porcentaje = 0;
            this.partidoR.forEach(member => {
                let porcentajeMember = member.votes_with_party_pct
                porcentaje = porcentaje + porcentajeMember;
            })
            porcentaje = porcentaje / this.partidoR.length
            if (isNaN(porcentaje)) {
                return 0;
            }
            return porcentaje
        },
        sumVotesD() {
            let porcentaje = 0;
            this.partidoD.forEach(member => {
                let porcentajeMember = member.votes_with_party_pct
                porcentaje = porcentaje + porcentajeMember;
            })
            porcentaje = porcentaje / this.partidoD.length
            if (isNaN(porcentaje)) {
                return 0;
            }
            return porcentaje
        },
        sumVotesID() {
            let porcentaje = 0;
            this.partidoID.forEach(member => {
                let porcentajeMember = member.votes_with_party_pct
                porcentaje = porcentaje + porcentajeMember;
            })
            porcentaje = porcentaje / this.partidoID.length
            if (isNaN(porcentaje)) {
                return 0;
            }
             return porcentaje
        }
    }
})
app.mount("#app")
