import { Module } from "@medusajs/utils";
import ReviewModuleService from "./service";

export default Module("reviewModuleService", {
  service: ReviewModuleService,
});
