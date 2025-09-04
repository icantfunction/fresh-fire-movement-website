import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import lynette1 from "@/assets/lynette-photo-1.jpg";
import lynette2 from "@/assets/lynette-photo-2.jpg";

const MeetTheTeam = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [lynette1, lynette2];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000); // Switch every 4 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="min-h-screen fire-gradient">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="mb-8 text-white border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur-sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center text-white">
            Meet the Team
          </h1>

          <Card className="bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-6 relative">
                <div className="w-48 h-48 rounded-full border-4 border-white/30 overflow-hidden mx-auto relative">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Mrs. Lynette Nelson - Photo ${index + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                        index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <CardTitle className="text-3xl text-white mb-2">
                Mrs. Lynette Nelson
              </CardTitle>
              <p className="text-fire-gold text-xl font-semibold">
                Executive Director
              </p>
            </CardHeader>
            <CardContent className="space-y-6 bg-white/15 rounded-lg mx-4 mb-4 p-6">
              <div className="text-gray-800 leading-relaxed space-y-4 text-base">
                <p>
                  Lynette S. Nelson was destined to worship the Lord through dance. Born and raised in the south suburbs of Chicago, her journey began in childhood and was solidified in 1996 when her aunt taught her a praise dance to honor her grandparents' retirement—a moment that forever changed her life. She later joined the dance ministry at St. James AME Church, where she served as co-director of both the youth and adult dance ministries. In 2012, she was appointed Dance Coordinator for the Chicago Conference–South District of the AME Church, supporting over 20 churches until relocating in 2015.
                </p>
                
                <p>
                  Now residing in South Florida, Lynette joined Christian Life Center (CLC) in 2016 and served as Spiritual Advisor for Fresh Fire Dance Ministry. In 2021, she became its Director, leading the ministry's expansion, including the launch of Fresh Fire Juniors and providing dance leadership across CLC's four campuses: Sunrise, Prospect, Coral Springs, and West Boca.
                </p>
                
                <p>
                  Beyond dance, Lynette and her husband, Hugh Nelson, serve together at CLC by teaching premarital classes and as prayer team leaders within the Spiritual Life Ministry. She is also a member of the Lay Ministry Cohort, supporting various ministries across the church wherever needed.
                </p>
                
                <p>
                  Lynette is a certified graduate of The Eagles Network (TEN), has attended national dance conferences, and is deeply committed to using dance to express God's love and healing. She holds a Bachelor of Science in Finance and an MBA from the University of Illinois Urbana-Champaign, and works professionally as a healthcare treasury consultant. She is joyfully married to Hugh and enjoys traveling, baking, and serving God with passion and purpose.
                </p>
              </div>
              
              <div className="bg-white/25 rounded-lg p-6 text-center mt-6">
                <h3 className="text-white font-bold text-xl mb-3 bg-fire-purple/80 px-4 py-2 rounded-lg">Her Life Verse</h3>
                <blockquote className="text-gray-800 italic text-lg font-medium">
                  "Nothing shall be able to separate us from the love of God, which is in Christ Jesus our Lord."
                </blockquote>
                <cite className="text-white font-bold bg-fire-magenta/80 px-3 py-1 rounded-md inline-block mt-2">Romans 8:39</cite>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MeetTheTeam;