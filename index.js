const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Define the centers and their product stock
const centers = {
    C1: { A: 3, B: 2, C: 8, D: 0, E: 0, F: 0, G: 0, H: 0, I: 0 },
    C2: { A: 0, B: 0, C: 0, D: 12, E: 25, F: 15, G: 0, H: 0, I: 0 },
    C3: { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0.5, H: 1, I: 2 }
};

// Define the distance between centers and location L1
const distances = {
    C1: 3, // Distance between C1 and L1
    C2: 2.5, // Distance between C2 and L1
    C3: 2  // Distance between C3 and L1
};

// Function to calculate the cost of delivery
function calculateCost(order) {
    let totalCost = 0;
    let lastCenter=null;
    
    // Calculate total cost based on order and center data
    for (const center in centers) {
        // Check if the product exists in any center
        let centerWeight = -1;
        
        for (const product in order) {
            if (centers[center][product] > 0) {
                
                //Checking last center
                if(lastCenter===null || lastCenter===center){
                    totalCost+=0;
                }else{
                    totalCost+=distances[center]*calculateCostPerUnit(0);
                    lastCenter=center;
                }
                // Calculate weight for the products based on quantity and weight
                centerWeight+= order[product] * centers[center][product];
                
            }
        }
        totalCost+=distances[center]*calculateCostPerUnit(centerWeight);
        lastCenter="L1";
    }

    return totalCost;
}

// Function to calculate cost per unit based on weight
function calculateCostPerUnit(weight) {
    if(weight===-1){
        return 0;
    }
    let cost = 10; // Base cost for up to 5 kgs
    if (weight > 5) {
        cost += Math.ceil((weight - 5) / 5) * 8;
    }
    return cost;
}


// Define the POST endpoint
app.post('/calculateCost', (req, res) => {
    try {
        const order = req.body;

        // Calculate minimum cost
        console.log("cost is "+ calculateCost(order));
        const minCost = calculateCost(order);

        // Send response with minimum cost
        res.json({ cost: minCost });
    } catch (error) {
        res.status(400).json({ error: 'Invalid input data' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});