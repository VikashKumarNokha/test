const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

const connect = () => {
  return mongoose.connect(
    "mongodb://localhost:27017/cscorner"
  );
};

//    user schema
  const userSchema = new mongoose.Schema(
    {
      firstName: { type: String, required: true },
      middleName: { type: String, required: false },
      lastName: { type: String, required: false },
      age :{type : Number, requared :true},  
      email: { type: String, required: true, unique: true },
      address : {type : String, requared : true},
      gender : {type : String, requared},
      Type : {type : string , requared : false},
      password: { type: String, required: true },
    },
    {
      versionKey: false,
      timestamps: true, // createdAt, updatedAt
    }
  );
  
  // Step 2 : creating the model
  const User = mongoose.model("user", userSchema); // user => users


    //   BranchDetail schema
  const  branchdetails = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      IFSC: { type: String, required: true },
      MICR: { type: String, required: true },
    },
    {
      versionKey: false,
      timestamps: true, // createdAt, updatedAt
    }
  );
  
  // Step 2 :- creating the model
  const BranchDetail = mongoose.model("branch", branchdetails); 


//   MasterAccount

const masteraccount = new mongoose.Schema(
    {
      balence: { type: String, required: true },
      branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "branch",
        required: true,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
    },
    {
      versionKey: false,
      timestamps: true,
    }
  );
  
  // Step 2 :- creating the model
  const MasterAccount = mongoose.model("master", masteraccount);
  

//   SavingsAccount  schema
const savingaccount = new mongoose.Schema(
    {
      Account_no: { type: String, required: true },
      interesr_rate: { type: String, required: true },
      masterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "master",
        required: true,
      },
      branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "branch",
        required: true,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
    },
    {
      versionKey: false,
      timestamps: true,
    }
  );
  
  // Step 2 :- creating the model
    const SavingsAccount = mongoose.model("saving", savingaccount);


    // FixedAccount   schema

    const fixedaccount = new mongoose.Schema(
        {
          start_date: { type: String, required: true },
          maturity_date: { type: String, required: true },
          masterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "master",
            required: true,
          },
          savingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "saving",
            required: true,
          },
        }, 
        {
          versionKey: false,
          timestamps: true,
        }
      );
      
      // Step 2 :- creating the model
        const FixedAccount = mongoose.model("fixed", fixedaccount);


          
    //    CRUD operation
    app.get("/users", async (req, res) => {
        try {
          const users = await User.find().lean().exec();
      
          return res.status(200).send({ users: users }); // []
        } catch (err) {
          return res
            .status(500)
            .send({ message: "Something went wrong .. try again later" });
        }
      });
      
      app.post("/users", async (req, res) => {
        try {
          const user = await User.create(req.body);
      
          return res.status(201).send(user);
        } catch (err) {
          return res.status(500).send({ message: err.message });
        }
      });
      
      // body => req.body
      // url => req.params
      // query string => req.query
      
      app.get("/users/:id", async (req, res) => {
        try {
          const user = await User.findById(req.params.id).lean().exec();
          // db.users.findOne({_id: Object('622893471b0065f917d24a38')})
      
          return res.status(200).send(user);
        } catch (err) {
          return res.status(500).send({ message: err.message });
        }
      });
      
      app.patch("/users/:id", async (req, res) => {
        try {
          const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
          })
            .lean()
            .exec();
          // db.users.update({_id: Object('622893471b0065f917d24a38')}, {$set: {req.body}})
      
          return res.status(200).send(user);
        } catch (err) {
          return res.status(500).send({ message: err.message });
        }
      });
      
      app.delete("/users/:id", async (req, res) => {
        try {
          const user = await User.findByIdAndDelete(req.params.id).lean().exec();
          // db.users.deleteOne({_id: Object('622893471b0065f917d24a38')})
      
          return res.status(200).send(user);
        } catch (err) {
          return res.status(500).send({ message: err.message });
        }
      });
            
        
      app.get("/masters", async (req, res) => {
        try {
          const posts = await BranchDetail.find().populate("userId").lean().exec();
          // .populate({path:"userId", selecte:{firstName :1, _id :0} }
      
          return res.status(200).send(posts);
        } catch (err) {
          return res.status(500).send({ message: err.message });
        }
      });

     
        app.listen(5000, async () => {
            try {
              await connect();
            } catch (err) {
              console.log(err);
            }
          
            console.log("listening on port 5000");
          });