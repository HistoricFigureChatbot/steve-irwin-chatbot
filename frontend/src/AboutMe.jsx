import "./AboutMe.css";

export default function AboutMe() {
  return (
    <div className="about-page-container">
      <div className="about-content">
        <h1>G'day! I'm Steve Irwin</h1>
        
        <div className="about-layout">
          <div className="images-left">
            <img src="/steve-with-tiger.png" alt="Steve with a tiger" className="side-image" />
            <img src="/steve-with-snake.png" alt="Steve holding a snake" className="side-image" />
            <img src="/steve-with-family.png" alt="Steve with his family" className="side-image" />
          </div>

          <div className="about-text">
            <p>
              Crikey! Thanks for stopping by, mate! I'm Steve Irwin, but you might know me as the Crocodile Hunter. 
              Let me tell ya a bit about myself and what makes me tick!
            </p>

            <h2>My Family - The Best Bunch of Wildlife Warriors!</h2>
            <p>
              I'm absolutely blessed to have the most incredible family a bloke could ask for. My beautiful wife, Terri, 
              is an absolute legend. She's from Oregon in the States, and we met back in 1991 when she visited Australia 
              Zoo. It was love at first sight, mate! We got married in June 1992, and she's been my partner in everything 
              ever since.
            </p>
            <p>
              We've got two ripper kids, Bindi Sue and Robert Clarence. Bindi was born in 1998, and I named her after 
              one of my favourite crocs! Little Robert came along in 2003, named after my dad. Both of them have inherited 
              the wildlife bug, and I couldn't be prouder watching them grow up around all these amazing animals.
            </p>
            <p>
              My mum and dad, Lyn and Bob Irwin, are the ones who started it all! Dad's a wildlife expert and mum was 
              a wildlife rehabilitator. They founded the Queensland Reptile and Fauna Park back in 1970, which later became 
              Australia Zoo. I grew up catching crocs with my dad, and he taught me everything I know!
            </p>

            <h2>My Favourite Animals - Crikey, They're All Beauties!</h2>
            <p>
              Now, everyone thinks I'm all about the crocs, and yeah, they're absolutely magnificent creatures! But I love 
              ALL animals, mate. From the deadliest snakes to the tiniest little insects, they all play a crucial role in 
              our ecosystem.
            </p>
            <p>
              Crocodiles are definitely special to me though. These prehistoric beauties have been around for millions of 
              years, and they deserve our respect and protection. I've been working with salties (saltwater crocodiles) 
              since I was nine years old! They're the largest reptilian predator on Earth, and absolutely magnificent.
            </p>
            <p>
              But don't forget about snakes! I reckon snakes are some of the most misunderstood creatures on the planet. 
              Whether it's a deadly taipan or a harmless python, each one is a beauty in its own right. And the venomous 
              ones? They're not out to get ya - they're just protecting themselves!
            </p>

            <h2>What I've Achieved - Living the Dream!</h2>
            <p>
              Mate, I've been so fortunate to live my passion every single day. "The Crocodile Hunter" TV series has let 
              me share my love for wildlife with millions of people around the world. We've filmed in some of the most 
              remote and dangerous places on Earth, all to show people how incredible these animals are!
            </p>
            <p>
              Australia Zoo has grown from my parents' small reptile park into one of the biggest and best wildlife 
              conservation facilities in the world. We've got over 1,200 animals here, and every one of them gets the 
              best care possible. It's not just a zoo - it's a conservation center where we're actively working to 
              protect endangered species.
            </p>
            <p>
              I've been honored with awards like being named Australian of the Year nominee and receiving the Centenary 
              Medal for service to global conservation. But honestly, the real achievement is every single animal we save 
              and every person we inspire to care about wildlife.
            </p>

            <h2>My Message to You</h2>
            <p>
              Remember, mate, wildlife conservation is not just a job, it's a way of life! Every single one of us has 
              the power to make a difference. Whether it's picking up rubbish, learning about local wildlife, or 
              supporting conservation organizations, YOU can be a wildlife warrior too!
            </p>
            <p>
              Crikey, I'm the luckiest bloke on Earth to be able to share my passion with all of you. So get out there, 
              respect nature, and never forget, whether it's a crocodile, a snake, or a tiny little frog, every creature 
              deserves our protection and admiration!
            </p>
            <p className="signature">
              Steve Irwin - The Crocodile Hunter 
            </p>
          </div>

          <div className="images-right">
            <img src="/Steve-with-croc.png" alt="Steve with a crocodile" className="side-image" />
            <img src="/wife-and-steve.png" alt="Steve and Terri with a python" className="side-image" />
            <img src="/croc-hunter.jpeg" alt="Steve and Terri with a crocodile" className="side-image" />
            <img src="/australia-zoo.jpg" alt="Australia Zoo logo" className="side-image" />
          </div>
        </div>
      </div>
    </div>
  );
}
