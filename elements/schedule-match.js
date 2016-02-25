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
        var blacklist = [34218850, 34218844];
        
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
        }

        participants.sort(sortPositions);
        
        for(var i = 0; i < participants.length; i++) {
            if(isBlacklist(participants[i].id)) {
                participants.splice(i, 1);
            }
        }

        for(var i = 0; i < participants.length; i++) {
            if(i + 1 < 10) {
                participants[i].rank = '#0' + (i + 1);
            } else {
                participants[i].rank = '#' + (i + 1);
            }
        }

        self.participants = participants;
    },
    ready: function() {
        this.$.ajax.generateRequest();
    }
});