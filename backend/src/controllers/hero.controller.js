import { StatusCodes } from 'http-status-codes';
import catchAsync from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import Hero from '../models/hero.model.js';

/**
 * Get hero content
 * GET /api/homepage/hero or /api/v1/homepage/hero
 */
export const getHero = catchAsync(async (req, res) => {
  const hero = await Hero.findOne();
  if (!hero) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Hero content not found. Please insert initial data.');
  }
  return sendSuccess(res, StatusCodes.OK, hero, 'Hero data fetched successfully');
});

/**
 * Replace hero content (Full update)
 * PUT /api/homepage/hero or /api/v1/homepage/hero
 */
export const updateHero = catchAsync(async (req, res) => {
  let hero = await Hero.findOne();

  if (!hero) {
    hero = new Hero(req.body);
    if (req.user) {
      hero.createdBy = req.user.email || req.user.id;
    }
  } else {
    hero.set(req.body);
  }

  if (req.user) {
    hero.updatedBy = req.user.email || req.user.id;
  }

  await hero.save();
  return sendSuccess(res, StatusCodes.OK, hero, 'Hero data updated successfully');
});

/**
 * Partially update hero content
 * PATCH /api/homepage/hero or /api/v1/homepage/hero
 */
export const patchHero = catchAsync(async (req, res) => {
  let hero = await Hero.findOne();

  if (!hero) {
    hero = new Hero(req.body);
    if (req.user) {
      hero.createdBy = req.user.email || req.user.id;
    }
  } else {
    const { slides, searchBar, joinTeam, decorativeShapes } = req.body;

    if (slides !== undefined) {
      hero.slides = slides;
    }

    if (searchBar) {
      hero.searchBar = {
        ...hero.searchBar?.toObject(),
        ...searchBar
      };
    }

    if (joinTeam) {
      hero.joinTeam = {
        ...hero.joinTeam?.toObject(),
        ...joinTeam
      };
    }

    if (decorativeShapes) {
      hero.decorativeShapes = {
        ...hero.decorativeShapes?.toObject(),
        ...decorativeShapes
      };
    }
  }

  if (req.user) {
    hero.updatedBy = req.user.email || req.user.id;
  }

  await hero.save();
  return sendSuccess(res, StatusCodes.OK, hero, 'Hero data updated successfully');
});
