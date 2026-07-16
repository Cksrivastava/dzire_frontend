import React from "react";
import { Link } from "react-router-dom";
import "./SportsInline.css";

const sportsData = [
  {
    title: "Badminton",
    links: [
      { name: "Badminton Racket", path: "/badminton/racket" },
      { name: "Adult Badminton Racket", path: "/badminton/adult-racket" },
      { name: "Junior Badminton Racket", path: "/badminton/junior-racket" },
      { name: "Badminton Shoes", path: "/badminton/shoes" },
      { name: "Mens Badminton Shoes", path: "/badminton/mens-shoes" },
      { name: "Womens Badminton Shoes", path: "/badminton/womens-shoes" },
      { name: "Kids Badminton Shoes", path: "/badminton/kids-shoes" },
      { name: "Badminton Jersey", path: "/badminton/jersey" },
      { name: "Mens Badminton Jerseys", path: "/badminton/mens-jersey" },
      { name: "Womens Badminton Jerseys", path: "/badminton/womens-jersey" },
      { name: "Kids Badminton Apparels", path: "/badminton/kids-apparel" },
      { name: "Badminton Shorts", path: "/badminton/shorts" },
      { name: "Mens Badminton Shorts", path: "/badminton/mens-shorts" },
      { name: "Womens Shorts & Skirts", path: "/badminton/womens-skirts" },
      { name: "Shuttlecocks", path: "/badminton/shuttlecock" },
      { name: "Plastic Shuttlecocks", path: "/badminton/plastic-shuttle" },
      { name: "Feather Shuttlecocks", path: "/badminton/feather-shuttle" },
      { name: "Badminton Accessories", path: "/badminton/accessories" },
      { name: "Badminton Grips", path: "/badminton/grips" },
      { name: "Badminton Net", path: "/badminton/net" },
      { name: "Racket Strings", path: "/badminton/strings" },
      { name: "Training Bands", path: "/badminton/training" },
      { name: "Racket Bags", path: "/badminton/bags" },
    ],
  },

  {
    title: "Tennis",
    links: [
      { name: "Tennis Rackets", path: "/tennis/rackets" },
      { name: "Tennis Balls", path: "/tennis/balls" },
      { name: "Tennis Shoes", path: "/tennis/shoes" },
      { name: "Tennis Tshirts", path: "/tennis/tshirts" },
      { name: "Tennis Shorts", path: "/tennis/shorts" },
      { name: "Tennis Skirts", path: "/tennis/skirts" },
      { name: "Tennis Socks", path: "/tennis/socks" },
      { name: "Tennis Accessories", path: "/tennis/accessories" },
      { name: "Tennis Bags", path: "/tennis/bags" },
      { name: "Tennis Grips", path: "/tennis/grips" },
    ],
  },

  {
    title: "Table Tennis",
    links: [
      { name: "Table Tennis Rackets", path: "/tt/rackets" },
      { name: "Table Tennis Balls", path: "/tt/balls" },
      { name: "Table Tennis Shoes", path: "/tt/shoes" },
      { name: "Table Tennis Accessories", path: "/tt/accessories" },
      { name: "Table Tennis Nets", path: "/tt/nets" },
      { name: "Racket Covers", path: "/tt/covers" },
      { name: "Tables", path: "/tt/tables" },
    ],
  },

  {
    title: "Squash",
    links: [
      { name: "Squash Rackets", path: "/squash/rackets" },
      { name: "Squash Balls", path: "/squash/balls" },
      { name: "Squash Shoes", path: "/squash/shoes" },
      { name: "Squash Accessories", path: "/squash/accessories" },
      { name: "Squash Kit Bags", path: "/squash/bags" },
    ],
  },

  {
    title: "Hiking & Trekking",
    links: [
      { name: "Hiking Shoes", path: "/hiking/shoes" },
      { name: "Men Hiking Shoes", path: "/hiking/men-shoes" },
      { name: "Women Hiking Shoes", path: "/hiking/women-shoes" },
      { name: "Kids Hiking Shoes", path: "/hiking/kids-shoes" },
      { name: "Trekking Shoes", path: "/hiking/trekking-shoes" },
      { name: "Hiking Tshirts", path: "/hiking/tshirts" },
      { name: "Men Hiking Tshirts", path: "/hiking/men-tshirts" },
      { name: "Women Hiking Tshirts", path: "/hiking/women-tshirts" },
      { name: "Hiking Shorts", path: "/hiking/shorts" },
    ],
  },

  {
    title: "Gym Equipment",
    links: [
      { name: "Dumbbells", path: "/gym/dumbbells" },
      { name: "Treadmills", path: "/gym/treadmills" },
      { name: "Exercise Bikes", path: "/gym/bikes" },
      { name: "Yoga Mats", path: "/gym/yoga-mats" },
      { name: "Kettlebells", path: "/gym/kettlebells" },
      { name: "Benches", path: "/gym/benches" },
    ],
  },
];

const SportsInline = () => {
  return (
    <section className="sports-inline-section">
      <div className="sports-inline-container">

        <h2>Our Sport Collections :</h2>

        {sportsData.map((sport, index) => (
          <p className="sports-line" key={index}>
            <strong>{sport.title} :</strong>

            {sport.links.map((link, i) => (
              <span key={i}>
                <Link to={link.path}>{link.name}</Link>
                {i !== sport.links.length - 1 && (
                  <span className="separator">|</span>
                )}
              </span>
            ))}
          </p>
        ))}

      </div>
    </section>
  );
};

export default SportsInline;