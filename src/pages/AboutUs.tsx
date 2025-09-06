import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-fire-gradient">
            Fresh Fire Dance Ministry
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-muted-foreground mb-4">
            By-Laws
          </h2>
        </div>

        <div className="space-y-8">
          {/* Ministry Definition */}
          <Card>
            <CardHeader>
              <CardTitle className="text-fire-gradient">Ministry Definition</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Fresh Fire Dance Ministry is a ministry under the Worship Arts Department of
                Christian Life Center, Inc. (CLC) under the direction of the Worship Pastor and
                Fresh Fire Dance Director at CLC Fort Lauderdale campus. Fresh Fire is the lead
                ministry of:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Fresh Fire Juniors (elementary and middle school)</li>
                <li>Fresh Wind Dance Ministry (Coral Springs Campus)</li>
                <li>Fresh Spirit Dance Ministry (Sunrise Campus)</li>
                <li>Fresh Rain (Spanish Campus at Prospect)</li>
                <li>Fresh Oil (West Boca Campus)</li>
                <li>All future dance ministries associated with Christian Life Center, Inc.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Mission Statement */}
          <Card>
            <CardHeader>
              <CardTitle className="text-fire-gradient">Mission Statement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <p>We believe in keeping the fire fresh in our relationship with God</p>
                <p>We believe in keeping relationships with one another fresh and healthy</p>
                <p>We believe in staying fresh in our gift</p>
                <p>We believe in training up fresh faces and serving</p>
              </div>
              <div className="flex flex-wrap gap-3 mt-6">
                <span className="px-4 py-2 bg-fire-purple/10 text-fire-purple rounded-full font-semibold">
                  ✓ Fresh Spirituality
                </span>
                <span className="px-4 py-2 bg-fire-magenta/10 text-fire-magenta rounded-full font-semibold">
                  ✓ Fresh Relationships
                </span>
                <span className="px-4 py-2 bg-fire-gold/10 text-amber-700 rounded-full font-semibold">
                  ✓ Fresh Faces
                </span>
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full font-semibold">
                  ✓ Fresh Impact
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Vision */}
          <Card>
            <CardHeader>
              <CardTitle className="text-fire-gradient">Vision</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <blockquote className="italic text-lg border-l-4 border-primary pl-4">
                "The world does not need another dance..." late Kimberly "Mama Kim" Smith
              </blockquote>
              <p>
                We are not performers; we are worshippers that minister in dance. Our
                purpose is to worship God in Spirit and in Truth (John 4:23). We are His vessels,
                consecrated for His work and for His glory! We use our broad range of spiritual
                gifts to serve the Lord and minister to others. Everything we do will be done with
                excellence...for an audience of One!
              </p>
            </CardContent>
          </Card>

          {/* Ministry Scriptural Inspiration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-fire-gradient">Ministry Scriptural Inspiration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-fire-purple">Hebrews 12:28-29</h4>
                <blockquote className="italic border-l-4 border-fire-purple pl-4">
                  Therefore, since we are receiving a kingdom that cannot be shaken, let us be
                  thankful, and so worship God acceptably with reverence and awe for our God is
                  a consuming fire.
                </blockquote>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-fire-magenta">Romans 12:1</h4>
                <blockquote className="italic border-l-4 border-fire-magenta pl-4">
                  Therefore, I urge you, brothers and sisters, in view of God's mercy, to offer your
                  bodies as a living sacrifice, holy and pleasing to God--this is your true and proper
                  worship
                </blockquote>
              </div>
            </CardContent>
          </Card>

          {/* Dance Ministry Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-fire-gradient text-2xl">Dance Ministry Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
                <p className="text-gray-700">
                  Fresh Fire is a ministry within the Worship Arts department at CLC. Therefore,
                  each worshipper must abide by the governing principles in the Worship Arts
                  Covenant and Fresh Fire guidelines as listed below:
                </p>
              </div>
              
              <div className="grid gap-8">
                {/* Spiritual Requirements */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                  <h4 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
                    <span className="w-2 h-8 bg-purple-600 rounded mr-3"></span>
                    Spiritual Requirements
                  </h4>
                  <ul className="space-y-3 ml-6">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Every member of Fresh Fire Dance Ministry must be a believer and follower of Jesus Christ and has accepted Him as their personal Lord and Savior with baptism by immersion in water</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Worshippers must stay connected to the Trinity (God the Father, The Son, and The Holy Spirit) through daily prayer and scriptural reading. They must also participate in corporate fasting periods orchestrated by CLC Senior Pastors and biblical study as determined by the Fresh Fire Dance Director and/or Spiritual Advisor. Each dancer is required to write devotionals per the schedule created by the Fresh Fire Prayer Ministry Team. Finally, it is expected that dancers attend corporate prayer with the Worship Arts department, every Tuesday morning at 6am EST on Zoom. The last Tuesday of every month, Fresh Fire will lead, and attendance and participation is mandatory</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;