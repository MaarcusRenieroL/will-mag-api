/* eslint-disable no-console */
import { faker } from "@faker-js/faker";

import { db } from "./index";

async function runSeed() {
  console.log("⏳ Running seed...");
  const start = Date.now();

  try {
    // Create more users with faker data
    const users = [];
    for (let i = 0; i < 25; i++) { // Increased from 10 to 25
      const user = await db.user.create({
        data: {
          email: faker.internet.email(),
          emailVerified: true,
          username: faker.internet.username(),
          displayUsername: faker.person.fullName(),
          role: i === 0 ? "ADMIN" : i === 1 ? "MODERATOR" : "USER", // First user is admin, second is moderator
          name: faker.person.fullName(),
          image: faker.image.avatar(),
        },
      });
      users.push(user);
    }

    // Create profiles for each user
    const profiles = [];
    for (const user of users) {
      const profile = await db.profile.create({
        data: {
          userId: user.id,
          bio: faker.lorem.paragraph(),
          avatarUrl: faker.image.avatar(),
          phone: faker.phone.number(),
          address: faker.location.streetAddress(),
          city: faker.location.city(),
          country: faker.location.country(),
          postalCode: faker.location.zipCode(),
          dateOfBirth: faker.date.birthdate({ min: 18, max: 65, mode: "age" }),
          gender: faker.helpers.arrayElement(["Male", "Female", "Non-binary"]),
          hobbiesAndPassions: faker.lorem.sentence(),
          paidVoterMessage: faker.lorem.sentence(),
          freeVoterMessage: faker.lorem.sentence(),
        },
      });
      profiles.push(profile);
    }

    // Create more contests
    const contests = [];
    for (let i = 0; i < 15; i++) { // Increased from 5 to 15
      const contest = await db.contest.create({
        data: {
          name: faker.company.catchPhrase(),
          description: faker.lorem.paragraph(),
          prizePool: faker.number.float({ min: 1000, max: 10000, fractionDigits: 2 }),
          startDate: faker.date.future(),
          endDate: faker.date.future({ years: 1 }),
        },
      });
      contests.push(contest);
    }

    // Create awards
    const awards = [];
    const awardNames = ["Best Photography", "Most Creative", "People's Choice", "Technical Excellence", "Innovation Award"];
    const awardIcons = ["📸", "🎨", "👥", "⚙️", "💡"];

    for (let i = 0; i < awardNames.length; i++) {
      const award = await db.award.create({
        data: {
          name: awardNames[i],
          icon: awardIcons[i],
        },
      });
      awards.push(award);
    }

    // Create contest participations
    for (const contest of contests) {
      for (const profile of profiles) {
        if (faker.datatype.boolean()) { // 50% chance to participate
          await db.contestParticipation.create({
            data: {
              profileId: profile.id,
              contestId: contest.id,
              coverImage: faker.image.url(),
              isApproved: faker.datatype.boolean(),
              isParticipating: faker.datatype.boolean(),
            },
          });
        }
      }
    }

    // Create more votes
    for (let i = 0; i < 50; i++) { // Increased from 20 to 50
      const voter = faker.helpers.arrayElement(profiles);
      const votee = faker.helpers.arrayElement(profiles.filter(p => p.id !== voter.id));
      const contest = faker.helpers.arrayElement(contests);

      await db.vote.create({
        data: {
          voterId: voter.id,
          voteeId: votee.id,
          contestId: contest.id,
          type: faker.helpers.arrayElement(["FREE", "PAID"]),
        },
      });
    }

    // Create some media files
    for (const profile of profiles) {
      for (let i = 0; i < faker.number.int({ min: 1, max: 5 }); i++) {
        await db.media.create({
          data: {
            key: faker.string.alphanumeric(10),
            name: faker.system.fileName(),
            url: faker.image.url(),
            size: faker.number.int({ min: 1000, max: 10000000 }),
            type: faker.helpers.arrayElement(["image/jpeg", "image/png", "image/webp"]),
            originalFileName: faker.system.fileName(),
            status: faker.helpers.arrayElement(["PROCESSING", "COMPLETED", "FAILED"]),
            profileId: profile.id,
          },
        });
      }
    }

    const end = Date.now();
    console.log(`✅ Seed completed in ${end - start}ms`);
    console.log(`📊 Created:`);
    console.log(`   - ${users.length} users`);
    console.log(`   - ${profiles.length} profiles`);
    console.log(`   - ${contests.length} contests`);
    console.log(`   - ${awards.length} awards`);
  }
  catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  }

  process.exit(0);
}

runSeed().catch((err) => {
  console.error("❌ Seed failed");
  console.error(err);
  process.exit(1);
});
