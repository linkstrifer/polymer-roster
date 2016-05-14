Polymer({
    is: 'schedule-match',
    properties: {
        participants: {
            type: Array,
            value: []
        },
        participantsTemp: {
            type: Array,
            value: []
        },
        data: {
            type: Object
        }
    },
    handleResponse: function() {
        var self = this;
        var data = this.data;
        var matches = data.tournament.matches;
        var participants = [];
        var scores = [];
        var blacklist = [34218850, 34218844, 34218853, 34218858, 34218843, 34218852, 34218857, 34218840, 34218846];
        
        function addPoints(element, index, array) {
            if(element.match.state === 'complete') {
                var score = element.match.scores_csv.split('-');
                var ID1 = element.match.player1_id;
                var ID2 = element.match.player2_id;
                scores[ID1] = (scores[ID1] === undefined) ? Number(score[0]) : scores[ID1] + Number(score[0]);
                scores[ID2] = (scores[ID2] === undefined) ? Number(score[1]) : scores[ID2] + Number(score[1]);
            }
        }
        
        function sortPositions(a, b) {
            return a.score > b.score ? -1 : 1;
        }

        function isBlacklist(id) {
            if(blacklist.indexOf(id) === -1) {
                return false;
            }

            return true;
        }
        
        matches.find(addPoints);
        
        for(var i = 0; i < data.tournament.participants.length; i++) {
            var tempParticipant = data.tournament.participants[i].participant;
            
            scores[tempParticipant.id] = (scores[tempParticipant.id] === undefined) ? 0 : scores[tempParticipant.id];

            participants.push({
                'id': tempParticipant.id,
                'name': tempParticipant.display_name,
                'score': scores[tempParticipant.id]
            });

            console.log(tempParticipant.display_name, tempParticipant.id);
        }

        participants.sort(sortPositions);

        self.participants = participants.filter(function(el) {
            if(!isBlacklist(el.id)) {
                return el;
            }
        });

        for(var i = 0; i < self.participants.length; i++) {
            if(i + 1 < 10) {
                self.participants[i].rank = '#0' + (i + 1);
            } else {
                self.participants[i].rank = '#' + (i + 1);
            }
        }
    },
    ready: function() {
        this.$.ajax.generateRequest();
    }
});