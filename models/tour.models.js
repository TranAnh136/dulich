const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const removeAccent = require("../util/removeAccent");

const tourSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false,
    default: "HCM"
  },
  price: {
    type: Number,
    required: true
  },
  tourType: {
    main: String,
    sub: String
  },
  pattern: {
    type: [String],
    required: false
  },
  tags: {
    type: [String],
    required: false
  },
  images: {
    type: [String],
    required: true
  },
  dateAdded: {
    type: Date,
    required: false,
    default: Date.now
  },
  isSale: {
    status: {
      type: Boolean,
      default: false
    },
    percent: {
      type: Number,
      default: 0
    },
    end: {
      type: Date
    }
  },
  ofSellers: {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    name: String
  },
  labels: {
    type: String,
    required: false,
    default: "Shiro"
  },
  buyCounts: {
    type: Number,
    required: false,
    default: 0
  },
  viewCounts: {
    type: Number,
    required: false,
    default: 0
  },
  rating: {
    byUser: String,
    content: String,
    star: Number
  },
  index: {
    type: Number,
    required: false,
    default: 0
  },
  comment: {
    total: {
      type: Number,
      require: false,
      default: 0
    },
    items: [
      {
        title: {
          type: String
        },
        content: {
          type: String
        },
        name: {
          type: String
        },
        date: {
          type: Date,
          default: Date.now
        },
        star: {
          type: Number
        }
      }
    ]
  }
});

const index = {
  name: "text",
  description: "text",
  labels: "text",
  "tourType.main": "text",
  tags: "text",
  ofSellers: "text"
};
tourSchema.index(index);

tourSchema.methods.getNonAccentType = function() {
  return removeAccent(this.tourType.main);
};

const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
