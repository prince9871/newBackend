const dbModel = require('../models/db')

const dbCreate = async (req, res) => {
  try {
    const newDbModel = new dbModel()

    newDbModel.name = req.body.name.toLowerCase()
    newDbModel.code = req.body.code
    newDbModel.quantity = req.body.quantity

    await newDbModel.save()

    return res.status(201).json({ message: 'New entry created successfully!' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


// const dbCreate = async (req, res, context) => {
//   try {
//     const newDbModel = new dbModel();

//     newDbModel.name = context.name.toLowerCase();
//     newDbModel.code = context.code;
//     newDbModel.quantity = context.quantity;

//     await newDbModel.save();

//     return res.status(201).json({ message: 'New entry created successfully!' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const processUserInput = (req, res) => {
//   const userMessage = req.body.message.toLowerCase();
//   if (userMessage === 'create') {
//     // Ask for details and move to the create context
//     const createContext = {
//       step: 1, // Track the step of the conversation
//       name: '',
//       code: '',
//       quantity: ''
//     };
//     return res.json({ message: 'Please enter the product name.' });
//   }

//   // Handle other types of user input or unrecognized commands here
//   // ...
// };

// const handleUserInput = (req, res) => {
//   const userMessage = req.body.message.toLowerCase();

//   // Context object to track the conversation flow
//   let context = {
//     step: 0, // Initial step
//     name: '',
//     code: '',
//     quantity: ''
//   };

//   switch (context.step) {
//     case 0:
//       // Initial step: Process user input and route to appropriate handlers
//       processUserInput(req, res, context);
//       break;
//     case 1:
//       // Create context: Get product name and move to the next step
//       context.name = userMessage;
//       context.step++;
//        res.json({ message: 'Please enter the product code.' });
//     case 2:
//       // Create context: Get product code and move to the next step
//       context.code = userMessage;
//       context.step++;
//        res.json({ message: 'Please enter the quantity.' });
//     case 3:
//       // Create context: Get product quantity and create the product entry
//       context.quantity = userMessage;
//       dbCreate(req, res, context);
//       break;
//     default:
//       // Handle unrecognized steps or commands
//       return res.json({ message: 'Sorry, I didn\'t understand that.' });
//   }
// };

// const handleUserInput = (req, res) => {
//   const userMessage = req.body.message.toLowerCase();

//   // Context object to track the conversation flow
//   let context = {
//     step: 0, // Initial step
//     name: '',
//     code: '',
//     quantity: '',
//   };

//   switch (context.step) {
//     case 0:
//       // Initial step: Process user input and route to appropriate handlers
//       processUserInput(req, res, context);
//       break;
//     case 1:
//       // Step 1: Ask for product name
//       context.name = userMessage;
//       context.step++;
//       res.json({ message: 'Please enter the product code.' });
//       break;
//     case 2:
//       // Step 2: Get product code, ask for product quantity
//       context.code = userMessage;
//       context.step++;
//       res.json({ message: 'Please enter the product quantity.' });
//       break;
//     case 3:
//       // Step 3: Get product quantity, create the product entry
//       context.quantity = userMessage;
//       dbCreate(req, res, context);
//       break;
//     default:
//       // Handle unrecognized steps or commands
//       return res.json({ message: 'Sorry, I didn\'t understand that.' });
//   }
// };










const dbGet = async (req, res) => {
  try {
    const name = req.query.name.toLowerCase()
    let result = await dbModel.findOne({ name: name })
    console.log(result)
    return res.send({ data: result })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const dbApiSend = async (req, res) => {
  console.log('cooming in this fuctnion')
  const { number, type, message, instance_id, access_token } = req.query

  if (!number || !type || !message || !instance_id || !access_token) {
    return res.status(400).json({ error: 'Missing required parameters' })
  }
  console.log('coming in backend')

  try {
    const result = await fetch(
      `https://ai.botcontrolpanel.com/api/send?number=${number}&type=${type}&message=${message}&instance_id=${instance_id}&access_token=${access_token}`,
      {
        method: 'get',
        headers: {
          'Content-type': 'application/json'
        }
      }
    )

    if (result.ok) {
      const data = await result.json()
      console.log('Backend Hit dbApiSend successfully:', data)
      res.json(data)
    } else {
      result = await result.json()
      console.log(result)
      console.log('Error in data fetching')
      res.status(result.status).json({ error: 'Error in data fetching' })
    }
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const dbApiMessages = async (req, res) => {
  let userMessage = req.body.message
  if (!userMessage) {
    return res.json({ message: 'Please Enter Some Values' })
  } else {
    userMessage = userMessage.toLowerCase()
    if (userMessage === 'start') {
      return res.json({
        message:
          'There are the following tips to use me:\nIf you want product details, enter a product name like a, b, test, test1.'
      })
    }
    const product = await dbModel.findOne({ name: userMessage })
    if (product) {
      const response = `${product.name}'s code is ${product.code} & quantity is ${product.quantity}`
      return res.json({ message: response })
    } else {
      return res.status(404).json({
        message:
          'Sorry, the product you are looking for was not found. Please try again with a different product name.'
      })
    }
  }
}

module.exports = { dbCreate, dbGet, dbApiSend, dbApiMessages, handleUserInput}
