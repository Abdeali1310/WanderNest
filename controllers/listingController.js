const Listing = require("../models/listing");

const showAllListings = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

const showList = async (req, res) => {
  const id = req.params.id;
  const list = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner")
    .exec();
  if (!list) {
    req.flash("error", "List not found!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { list });
};

const createNewListForm = async (req, res) => {
  res.render("listings/new.ejs");
};

const createNewList = async (req, res, next) => {
  const { title, description, image, price, country, location } = req.body;
  const url = req.file.path;
  const filename = req.file.filename
  //checking for custom error
  const newList = new Listing({
    title,
    description,
    image,
    price,
    country,
    location,
  });
  newList.owner = req.user._id;
  newList.image = {url,filename}
  await newList.save();
  //flash message for listing created
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

const editNewListForm = async (req, res) => {
  const id = req.params.id;
  const list = await Listing.findById(id);
  if (!list) {
    req.flash("error", "List not found!");
    res.redirect("/listings");
  }
  let originalImgUrl = list.image.url;
  originalImgUrl = originalImgUrl.replace("/upload","/upload/w_250/e_blur:300")
  res.render("listings/edit.ejs", { list,originalImgUrl });
};

const editNewList = async (req, res) => {
  const id = req.params.id;
  const { title, description, image, price, country, location } = req.body;
  const editedUser = await Listing.findByIdAndUpdate(
    { _id: id },
    { title, description, price, country, location }
  );

  if(typeof req.file !== 'undefined'){
    const url = req.file.path;
    editedUser.image.url = url;
    editedUser.save();
  }
  req.flash("success", "Listing Edited!");
  res.redirect(`/listings/${id}`);
};

const destroyList = async (req, res) => {
  const id = req.params.id;
  const deletedList = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

module.exports = {
  showAllListings,
  createNewListForm,
  createNewList,
  editNewListForm,
  editNewList,
  destroyList,
  showList,
};
