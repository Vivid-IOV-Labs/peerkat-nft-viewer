//Example of metadata with content
const metadataWithCOntetn = {
  name: "VIP 860/999",
  description:
    "This NFT has been minted in 999 pieces by Aesthetes SRL for its new VIP newsletter.",
  author: {
    type: "default",
    version: "1.0.0",
    name: "Aesthetes srl",
  },
  content: "cid:QmdVmsUu3kttctD5iLzsdHNqNB47ZBzxE2xr8wjWtUTxc7",
  issuer: "rHTPa44d171cVAtgdLGraGhvUB7QyHr4si",
  type: "Aesthetes-XLS20",
  version: "1.0.0",
};
//Example of metadata in metadata

const metadataWithMetadata = {
  metadata: {
    attributes: [
      {
        description: "Edition",
        trait_type: "Edition",
        value: "7",
      },
      {
        description: "Issue",
        trait_type: "Issue",
        value: "1",
      },
    ],
    collection: {
      name: "Zero-G & the Galaxy Guards - Issue #1",
      family: "Galaxy Coin NFTs",
    },
    video:
      "ipfs://bafybeifbaokeqyxmuczxf5zttpbgp52r7jf6fktvrnmnkfyuuy3feveiwe/galaxy guards comic #1 edition 7.mp4",
    animation: "",
    external_link: "",
    audio: "",
    name: "Galaxy Guards Issue One # 491",
    image:
      "ipfs://bafybeifbaokeqyxmuczxf5zttpbgp52r7jf6fktvrnmnkfyuuy3feveiwe/galaxy guards comic #1 edition 7.png",
    taxon: 585,
    description:
      "This Galaxy Guard 22-page comic book is a new way to engage audiences in a unique story arc available on the XRP ledger. Follow the adventures of Zero-G and his unusual friends as they travel through galaxies and complete missions to find a way home.",
    schema: "ipfs://QmNpi8rcXEkohca8iXu7zysKKSJYqCvBJn3xJwga8jXqWU",
    nftType: "art.v0",
    id: "240f9640f11d8e4d3b25fc9a49c50575:1674238759034",
    file: "",
  },
};
