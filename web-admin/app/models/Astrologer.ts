import mongoose, { Schema, Document, Model } from 'mongoose';

// Service interface
export interface IService {
  name: string;
  duration: string;
  price: number;
  description: string;
  tag: 'intro' | 'popular' | '';
}

// Astrologer interface
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
  createdAt: Date;
  updatedAt: Date;
}

// Service schema
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

// Astrologer schema
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
        validator: function(v: string[]) {
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
        validator: function(v: IService[]) {
          return v && v.length > 0;
        },
        message: 'At least one service must be specified',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
AstrologerSchema.index({ name: 1 });
AstrologerSchema.index({ available: 1 });
AstrologerSchema.index({ rating: -1 });

// Prevent model recompilation in development
const Astrologer: Model<IAstrologer> = 
  mongoose.models.Astrologer || mongoose.model<IAstrologer>('Astrologer', AstrologerSchema);

export default Astrologer;