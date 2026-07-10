import mongoose from 'mongoose';

const localizedStringSchema = new mongoose.Schema({
  en: { type: String, required: true },
  bn: { type: String, required: true }
}, { _id: false });

const slideButtonSchema = new mongoose.Schema({
  label: { type: localizedStringSchema, required: true },
  link: { type: String, required: true },
  variant: { type: String, required: true }
}, { _id: false });

const slideSchema = new mongoose.Schema({
  id: { type: Number },
  slideNumber: { type: String, required: true },
  heading: { type: localizedStringSchema, required: true },
  description: { type: localizedStringSchema, required: true },
  image: { type: String, required: true },
  buttons: { type: [slideButtonSchema], default: [] }
}, { _id: false });

const searchBarSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  title: { type: localizedStringSchema, required: true },
  searchPlaceholder: { type: localizedStringSchema, required: true },
  locationPlaceholder: { type: localizedStringSchema, required: true },
  advancedSearchLink: { type: localizedStringSchema, required: true }
}, { _id: false });

const joinTeamSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  question: { type: localizedStringSchema, required: true },
  title: { type: localizedStringSchema, required: true },
  buttonLabel: { type: localizedStringSchema, required: true },
  buttonLink: { type: String, required: true },
  image: { type: String, required: true }
}, { _id: false });

const shapeSchema = new mongoose.Schema({
  color: { type: String, required: true },
  size: { type: Number, required: true },
  position: { type: Map, of: String, default: {} }, // supports "top", "left", "bottom", "right"
  opacity: { type: Number, required: true }
}, { _id: false });

const decorativeShapesSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  shapes: { type: [shapeSchema], default: [] }
}, { _id: false });

const heroSchema = new mongoose.Schema(
  {
    slides: { type: [slideSchema], default: [] },
    searchBar: { type: searchBarSchema, required: true },
    joinTeam: { type: joinTeamSchema, required: true },
    decorativeShapes: { type: decorativeShapesSchema, required: true },
    createdBy: { type: String },
    updatedBy: { type: String }
  },
  {
    timestamps: true,
    collection: 'heroes'
  }
);

const Hero = mongoose.model('Hero', heroSchema);

export default Hero;
