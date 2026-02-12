import mongoose, { Schema, Document, Model } from 'mongoose';

/* ============================
   Service Interface
============================ */
export interface IService {
  name: string;
  duration: string;
  price: number;
  description: string;
  tag: 'intro' | 'popular' | '';
}

/* ============================
   Slot Interface
============================ */
export interface ISlot {
  time: string; // "18:30"
  isBooked: boolean;
}

/* ============================
   Availability Interface
============================ */
export interface IAvailability {
  date: string; // "2026-02-15"
  slots: ISlot[];
}

/* ============================
   Astrologer Interface
============================ */
export interface IAstrologer extends Document {
  name: string;
  expertise: string;
  experience: string;
  languages: string[];
  price: number;
  rating: number;
  reviews: number;
  available: boolean;
  services: IService[];
  availability: IAvailability[];
  createdAt: Date;
  updatedAt: Date;
}

/* ============================
   Service Schema
============================ */
const ServiceSchema = new Schema<IService>({
  name: {
    type: String,
    required: [true, 'Service name is required'],
  },
  duration: {
    type: String,
    required: [true, 'Service duration is required'],
  },
  price: {
    type: Number,
    required: [true, 'Service price is required'],
    min: [0, 'Price cannot be negative'],
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
  },
  tag: {
    type: String,
    enum: ['intro', 'popular', ''],
    default: '',
  },
});

/* ============================
   Slot Schema
============================ */
const SlotSchema = new Schema<ISlot>({
  time: {
    type: String,
    required: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
});

/* ============================
   Availability Schema
============================ */
const AvailabilitySchema = new Schema<IAvailability>({
  date: {
    type: String,
    required: true,
  },
  slots: {
    type: [SlotSchema],
    validate: {
      validator: function (v: ISlot[]) {
        return v && v.length > 0;
      },
      message: 'At least one slot is required per date',
    },
  },
});

/* ============================
   Astrologer Schema
============================ */
const AstrologerSchema = new Schema<IAstrologer>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    expertise: {
      type: String,
      required: [true, 'Expertise is required'],
      trim: true,
    },
    experience: {
      type: String,
      required: [true, 'Experience is required'],
    },
    languages: {
      type: [String],
      required: [true, 'At least one language is required'],
      validate: {
        validator: function (v: string[]) {
          return v && v.length > 0;
        },
        message: 'At least one language must be specified',
      },
    },
    price: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Price cannot be negative'],
    },
    rating: {
      type: Number,
      required: true,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
      default: 0,
    },
    reviews: {
      type: Number,
      required: true,
      min: [0, 'Reviews cannot be negative'],
      default: 0,
    },
    available: {
      type: Boolean,
      default: true,
    },
    services: {
      type: [ServiceSchema],
      required: [true, 'At least one service is required'],
      validate: {
        validator: function (v: IService[]) {
          return v && v.length > 0;
        },
        message: 'At least one service must be specified',
      },
    },
    availability: {
      type: [AvailabilitySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

/* ============================
   Indexes (Important)
============================ */

// Faster search
AstrologerSchema.index({ name: 1 });
AstrologerSchema.index({ available: 1 });
AstrologerSchema.index({ rating: -1 });

// For booking performance
AstrologerSchema.index({ 'availability.date': 1 });
AstrologerSchema.index({ 'availability.slots.time': 1 });

/* ============================
   Prevent Model Recompile
============================ */
const Astrologer: Model<IAstrologer> =
  mongoose.models.Astrologer ||
  mongoose.model<IAstrologer>('Astrologer', AstrologerSchema);

export default Astrologer;
