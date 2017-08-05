/*
 * Available information:
 * 1. Request queue
 * Simulator.get_instance().get_requests()
 * Array of integers representing floors where there are people calling the elevator
 * eg: [7,3,2] // There are 3 people waiting for the elevator at floor 7,3, and 2, in that order
 * 
 * 2. Elevator object
 * To get all elevators, Simulator.get_instance().get_building().get_elevator_system().get_elevators()
 * Array of Elevator objects.
 * - Current floor
 * elevator.at_floor()
 * Returns undefined if it is moving and returns the floor if it is waiting.
 * - Destination floor
 * elevator.get_destination_floor()
 * The floor the elevator is moving toward.
 * - Position
 * elevator.get_position()
 * Position of the elevator in y-axis. Not necessarily an integer.
 * - Elevator people
 * elevator.get_people()
 * Array of people inside the elevator
 * 
 * 3. Person object
 * - Floor
 * person.get_floor()
 * - Destination
 * person.get_destination_floor()
 * - Get time waiting for an elevator
 * person.get_wait_time_out_elevator()
 * - Get time waiting in an elevator
 * person.get_wait_time_in_elevator()
 * 
 * 4. Time counter
 * Simulator.get_instance().get_time_counter()
 * An integer increasing by 1 on every simulation iteration
 * 
 * 5. Building
 * Simulator.get_instance().get_building()
 * - Number of floors
 * building.get_num_floors()
 */

Elevator.prototype.decide = function() {
    var simulator = Simulator.get_instance();
    var elevators = Simulator.get_instance().get_building().get_elevator_system().get_elevators();
    var requests = simulator.get_requests();
    var elevator = this;
    var people = this.get_people();
    
    // Handle request yang belum diambil elevator lain
    var unhandled_requests = [];
    for(var i = 0;i < requests.length;i++) {
        var handled = false;
        for(var j = 0;j < elevators.length;j++) {
            if(elevators[j].get_destination_floor() == requests[i]) {
                handled = true;
                break;
            }
        }
        if(!handled) {
            unhandled_requests.push(requests[i]);
        }
    }

    // Cari lantai terdekat berdasarkan request dan people.get_destination_floor
    var gap = 100;
    var closest_floor = false;
    var current_floor = elevator.at_floor();
    var people_destination = people.map(function(person){ return person.get_destination_floor() });
    var elevator_queue = people_destination.concat(unhandled_requests);
    elevator_queue = elevator_queue.filter(function(v, i, self){ return self.indexOf(v) == i; })
    
    for(var i=0, l=elevator_queue.length; i<l; i++) {
        if (gap > Math.abs(current_floor - elevator_queue[i])) {
            gap = Math.abs(current_floor - elevator_queue[i]);
            closest_floor = elevator_queue[i];
        }
    }

    if (closest_floor !== false) {
        return this.commit_decision(closest_floor);
    }

    return this.commit_decision(1);
};
