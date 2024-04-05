import { readFileSync } from "fs";
import { CeramicClient } from "@ceramicnetwork/http-client";
import {
  createComposite,
  readEncodedComposite,
  writeEncodedComposite,
  writeEncodedCompositeRuntime,
} from "@composedb/devtools-node";
import { Composite } from "@composedb/devtools";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { fromString } from "uint8arrays/from-string";

const ceramic = new CeramicClient("http://localhost:7007");

/**
 * @param {Ora} spinner - to provide progress status.
 * @return {Promise<void>} - return void when composite finishes deploying.
 */
export const writeComposite = async (spinner) => {
  await authenticate();
  // const profileComposite = await createComposite(
  //   ceramic,
  //   "./composites/00-basicProfile.graphql"
  // );
  const profileComposite = await readEncodedComposite(
    ceramic,
    "./composites/00-profile.json"
  );

  const profileOwnerSchema = readFileSync("./composites/01-profileOwner.graphql", {
    encoding: "utf-8",
  }).replace("$PROFILE_ID", profileComposite.modelIDs[1]);

  const profileOwnerComposite = await Composite.create({
    ceramic,
    schema: profileOwnerSchema,
  });

  const voteSchema = readFileSync("./composites/02-vote.graphql", {
    encoding: "utf-8",
  });

  const voteComposite = await Composite.create({
    ceramic,
    schema: voteSchema,
  });

  const commentSchema = readFileSync("./composites/03-comment.graphql", {
    encoding: "utf-8",
  });

  const commentComposite = await Composite.create({
    ceramic,
    schema: commentSchema,
  });

  const projectSchema = readFileSync("./composites/04-project.graphql", {
    encoding: "utf-8",
  })
    .replace("$VOTABLE_ID", voteComposite.modelIDs[0])
    .replace("$VOTE_ID", voteComposite.modelIDs[1])
    .replace("$COMMENTABLE_ID", commentComposite.modelIDs[0])
    .replace("$COMMENT_ID", commentComposite.modelIDs[1]);

  const projectComposite = await Composite.create({
    ceramic,
    schema: projectSchema,
  });

  // const projectCommentableSchema = readFileSync("./composites/05-projectCommentable.graphql", {
  //   encoding: "utf-8",
  // })
  //   .replace("$PROJECT_ID", projectComposite.modelIDs[5])
  //   .replace("$COMMENTABLE_ID", commentComposite.modelIDs[0])
  //   .replace("$COMMENT_ID", commentComposite.modelIDs[1]);

  // const projectCommentableComposite = await Composite.create({
  //   ceramic,
  //   schema: projectCommentableSchema,
  // });

  // const subscriptionSchema = readFileSync("./composites/03-subscription.graphql", {
  //   encoding: "utf-8",
  // });

  // const subscriptionComposite = await Composite.create({
  //   ceramic,
  //   schema: subscriptionSchema,
  // });

  // const commentsSchema = readFileSync("./composites/04-comments.graphql", {
  //   encoding: "utf-8",
  // })
  //   .replace("$POSTS_ID", postsComposite.modelIDs[1])
  //   .replace("$PROFILE_ID", profileComposite.modelIDs[0]);

  // const commentsComposite = await Composite.create({
  //   ceramic,
  //   schema: commentsSchema,
  // });

  // const commentsPostsSchema = readFileSync(
  //   "./composites/05-commentsPosts.graphql",
  //   {
  //     encoding: "utf-8",
  //   }
  // )
  //   .replace("$COMMENTS_ID", commentsComposite.modelIDs[2])
  //   .replace("$POSTS_ID", postsComposite.modelIDs[1]);

  // const commentsPostsComposite = await Composite.create({
  //   ceramic,
  //   schema: commentsPostsSchema,
  // });

  const composite = Composite.from([
    profileComposite,
    profileOwnerComposite,
    voteComposite,
    commentComposite,
    projectComposite,
    // projectCommentableComposite,
    // subscriptionComposite,
    // commentsComposite,
    // commentsPostsComposite,
  ]);

  await writeEncodedComposite(composite, "./__generated__/definition.json");
  spinner.info("creating composite for runtime usage");
  await writeEncodedCompositeRuntime(
    ceramic,
    "./__generated__/definition.json",
    "./__generated__/definition.js"
  );
  spinner.info("deploying composite");
  const deployComposite = await readEncodedComposite(
    ceramic,
    "./__generated__/definition.json"
  );

  await deployComposite.startIndexingOn(ceramic);
  spinner.succeed("composite deployed & ready for use");
};

/**
 * Authenticating DID for publishing composite
 * @return {Promise<void>} - return void when DID is authenticated.
 */
const authenticate = async () => {
  const seed = readFileSync("./admin_seed.txt");
  const key = fromString(seed, "base16");
  const did = new DID({
    resolver: getResolver(),
    provider: new Ed25519Provider(key),
  });
  await did.authenticate();
  ceramic.did = did;
};
