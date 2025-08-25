import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Navigation />
      <div className="pt-20">
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
              <CardTitle className="text-fire-gradient">Dance Ministry Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>
                Fresh Fire is a ministry within the Worship Arts department at CLC. Therefore,
                each worshipper must abide by the governing principles in the Worship Arts
                Covenant and Fresh Fire guidelines as listed below:
              </p>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Spiritual Requirements</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Every member of Fresh Fire Dance Ministry must be a believer and follower of Jesus Christ and has accepted Him as their personal Lord and Savior with baptism by immersion in water</li>
                    <li>Worshippers must stay connected to the Trinity (God the Father, The Son, and The Holy Spirit) through daily prayer and scriptural reading. They must also participate in corporate fasting periods orchestrated by CLC Senior Pastors and biblical study as determined by the Fresh Fire Dance Director and/or Spiritual Advisor. Each dancer is required to write devotionals per the schedule created by the Fresh Fire Prayer Ministry Team. Finally, it is expected that dancers attend corporate prayer with the Worship Arts department, every Tuesday morning at 6am EST on Zoom. The last Tuesday of every month, Fresh Fire will lead, and attendance and participation is mandatory</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Youth Dance Worshippers (high school):</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Are required to be active members of Powerhouse and attend worship services on a regular basis</li>
                    <li>Have attended Youth Camp/Youth Encounter/Collide Revival Services</li>
                    <li>Have attended Youth School of Discipleship (SOD)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Adult Dance Worshippers:</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Are required to be active members of Christian Life Center and regularly attend worship services and give tithes/offerings</li>
                    <li>Have attended Encounter and completed School of Discipleship (under the Director's discretion, dancer may minister while attending SOD)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Dancers Social Media Conduct</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>All dancers must conduct themselves in a manner consistent with being a worshipper of the Most High God Therefore, social media presence should align with biblical values and principles.</li>
                    <li>To maintain the integrity of Fresh Fire Dance Ministry, dancers must make social media accounts accessible to Fresh Fire leadership</li>
                    <li>If social media posts made by Fresh Fire Dancers deviate from the values of the ministry, the dancer will be held accountable with consequences determined by the Director</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Dance Necessities:</h4>
                  <p className="mb-2">Every dancer is required to purchase:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Black long-sleeved leotard</li>
                    <li>White long-sleeved leotard</li>
                    <li>Black Humble pants</li>
                    <li>White Humble pants</li>
                    <li>Black leggings</li>
                    <li>White leggings</li>
                    <li>Assigned books or educational material</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Monthly Donations:</h4>
                  <p className="mb-2">Every dancer is required to donate to the ministry each month to support ministry operations inclusive of:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Garments</li>
                    <li>Instruments (flags, banners, streamers, tambourines, mattah sticks, billows, etc.)</li>
                    <li>Community enrichment activities</li>
                    <li>External training and conferences</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Rehearsal Protocols:</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">Fresh Fire rehearsal schedule:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Sundays from 1:30-4pm EST</li>
                        <li>Thursdays from 6:30-8:30pm EST</li>
                        <li>Practice days and times are subject to change</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="font-medium">Attendance Requirements:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Dancers are expected to attend ALL rehearsals and be on time.</li>
                        <li>Dancers must notify the Director in advance, if they will be absent or late to rehearsals</li>
                        <li>If a dancer is late and does not have Director's approval, the dancer is required to run laps, for each minute late, from the scheduled practice time</li>
                        <li>Unless granted approval by the Director, a dancer will not be permitted to participate if they exceed the allowable number of exceptions within a given season. Exceptions are determined by the Director and may include, but are not limited to, absences from mandatory rehearsals, late devotional submissions, missed attendance at Tuesday Worship Prayer meetings, and missed accountability workouts with their assigned brother or sister. Seasons are defined as Christmas, Easter, and Summer</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-medium">Dancer rehearsal attire:</p>
                      <p className="mb-2">Dancer attire is modest; therefore, a dancer should not wear tight clothing, jeans, mid-drift shirts, shorts above the knee, tank tops, or any piece of revealing clothing at rehearsals or during preparation time before ministering</p>
                      
                      <div className="ml-4 space-y-3">
                        <div>
                          <p className="font-medium">Women</p>
                          <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Black Tee Shirt (Fresh Fire, CLC or Christian Based)</li>
                            <li>Sports bra</li>
                            <li>Black joggers/leggings/palazzos/sweatpants</li>
                            <li>"Wrap arounds" which is a garment tied around the dancer's waist (scarf, sweater, long sleeve shirt, etc.)</li>
                          </ul>
                        </div>
                        
                        <div>
                          <p className="font-medium">Men</p>
                          <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Black Tee Shirt (Fresh Fire, CLC or Christian Based)</li>
                            <li>Loose fit black joggers/sweatpants</li>
                          </ul>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <p>When at rehearsal and ministering, dancer's appearance must be honorable so that nothing will distract from the working of the Lord</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Hair is required to be neatly pulled away from a dancer's face into a bun, ponytail, or pinned up style. No flowing hair is allowed</li>
                          <li>Studded earrings, wedding or promise rings are the only jewelry allowed (no necklaces, bracelets, etc.)</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium">Hygiene Requirements:</p>
                      <p className="mb-2">Our bodies are the temple of the Holy Spirit (1 Corinthians 6:19)! We must always maintain proper hygiene at rehearsals and ministry engagements.</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Dancers should bring a hygiene kit to rehearsal and ministry engagements inclusive of deodorant, cleansing wipes, body spray/perfume/cologne, extra undergarments, etc.</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-medium">Additional Rehearsal Rules:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>During rehearsal there will be no gossiping, complaining, negative comments, or eating (only water is allowed)</li>
                        <li>Practices are closed. NO friends/family/children allowed. If there is an unforeseen circumstance where a child needs to stay during practice, Director approval is required</li>
                        <li>Corporate rehearsal is not enough!! Dancers are required to practice at home and maintain consistent workouts in between scheduled rehearsals</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Ministry Engagement Protocols:</h4>
                  <div className="space-y-4">
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>All worshippers will be required to participate in a consecration period prior to ministering in dance. Consecration includes, but is not limited to, fasting with dedicated times of prayer and worship. Often these times will require removal of distractions and dependencies such as food, social media, secular music/movies/shows, etc.</li>
                    </ul>
                    
                    <div>
                      <p className="font-medium">On the day of in-house ministry:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Worshippers will be required to be on time for sound check and run throughs per the direction of Worship Arts leadership</li>
                        <li>For weekly worship, dancers are required to attend pre-service prayer with the Worship Arts department before ministering</li>
                      </ul>
                      
                      <div className="mt-3">
                        <p className="font-medium">Dancers shall be dressed in dance foundations as follows:</p>
                        <div className="ml-4 space-y-3 mt-2">
                          <div>
                            <p className="font-medium">Women</p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                              <li>Leotard</li>
                              <li>Black tee shirt or sweatshirt over leotards "wrap-around" garment around dancer's waist</li>
                              <li>Humble pants, palazzos, or loose-fitting pants</li>
                            </ul>
                          </div>
                          
                          <div>
                            <p className="font-medium">Men</p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                              <li>Black tee shirt or sweatshirt with V-neck undershirt underneath</li>
                              <li>Loose-fitting pants</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium">All rehearsal protocol is required for ministry engagements with the following additions:</p>
                      <div className="ml-4 space-y-3 mt-2">
                        <div>
                          <p className="font-medium">Women</p>
                          <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Nail color: only neutral (pastels and nudes) fingernail polish can be worn. Bold and dark nail colors with excessive designs are not acceptable</li>
                            <li>Undergarments: only solid (no printed designs) black- or flesh-colored supportive bras (no razorback) and underwear are allowed. Make sure that undergarments support body movement and offer full coverage (i.e. brief underwear/sports bras)</li>
                          </ul>
                        </div>
                        
                        <div>
                          <p className="font-medium">Men</p>
                          <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Undergarments: black or white V neck undershirts.</li>
                            <li>Make sure that undergarments support body movement and offer full coverage (i.e. briefs, no boxer shorts)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ministry Positions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-fire-gradient">Ministry Positions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="italic">Note: All leadership positions of Fresh Fire dance ministry have oversight of campus ministries</p>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-fire-purple mb-2">Director</h4>
                  <p>The Director is the leader of the ministry and the primary point of contact for all aspects of the dance ministry across CLC campuses. They ensure that the ministry aligns with the Word of God and adheres to the constitution and by-laws of CLC. The Director holds final authority in the appointment of leadership positions and exercises spiritual discernment before accepting any dancing engagement. As the ministry's spiritual leader and visionary, they provide guidance and direction to uphold the ministry's mission and purpose.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-fire-magenta mb-2">Assistant Director</h4>
                  <p>The Assistant Director is responsible for overseeing all administrative and organizational functions of the ministry and serves as the liaison across all CLC campuses. This role works closely with the Director and coordinates with pastoral staff to ensure the effective distribution of information related to the dance ministry. In the absence of the Director, the Assistant Director serves as the Lead.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-amber-700 mb-2">Director of Choreography</h4>
                  <p>The Director of Choreography leads creative content and holds the final authority in selecting dancers to create choreography. They consult with the Director regarding dance garments, instruments, and dancer selection for ministry pieces. This role is responsible for organizing training opportunities and workshops for dancers. Members of the choreography team report to this position, ensuring movements are clean, precise, and executed with excellence for the Lord.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-primary mb-2">Director of Dance Development</h4>
                  <p>The Director of Dance Development oversees the cultivation of temple stewardship—mind, body, soul, and spirit. This role includes in-house conditioning, technique advancement, nutritional guidance and creating workout routines that enhance dancers' strength, flexibility, and endurance. They collaborate with the Spiritual Advisor to promote healthy mental practices within the ministry and work alongside the Director of Choreography to support external dance development.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-fire-purple mb-2">Director of Marketing</h4>
                  <p>The Director of Marketing is responsible for promoting the Fresh Fire Dance Ministry brand. They oversee all social media content, ensuring posts reflect God, CLC, and Fresh Fire Dance Ministry appropriately. This role also serves as the primary contact for the CLC Media team to develop digital announcements for services. The marketing team reports to this position.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-fire-magenta mb-2">Spiritual Advisor</h4>
                  <p>The Spiritual Advisor leads Bible study and devotional topic discussions and works with the Director to select reading materials that foster spiritual growth. While the Director may delegate others to lead as appropriate, this role ensures that biblical teachings remain a central component of the ministry. The Spiritual Advisor also helps maintain spiritual unity among dancers, coordinates continuing education, serves as an intercessor for Fresh Fire, and acts as a liaison to the prayer ministry within the Worship Arts department.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-amber-700 mb-2">Director of Community Enrichment</h4>
                  <p>The Director of Community Enrichment creates opportunities for dancers to build and maintain authentic relationships. This role is responsible for organizing retreats, social gatherings, and outreach efforts, aligning with and executing the Director's vision for community engagement.</p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-primary mb-4">Ministry Associate Positions</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-2">Administrative Assistant</h5>
                      <p className="mb-2">The Administrative Assistant supports the Assistant Director in overseeing the administrative and organizational functions of the ministry. This role assists with delegated tasks to ensure smooth ministry operations and serves as an additional resource to both the Assistant Director and Director.</p>
                      <p className="font-medium mb-1">Responsibilities:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Assist the Assistant Director with administrative tasks, including scheduling, communication, and documentation</li>
                        <li>Help manage the distribution of information across all CLC campuses in coordination with the Assistant Director</li>
                        <li>Support the Director by providing an extra set of hands for various ministry functions, including ministry engagement preparation, rehearsal logistics, and resource organization</li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Garments/Instrument Coordinator</h5>
                      <p>The Garments/Instrument Coordinator is responsible for organizing and maintaining ministry garments and instruments. They oversee uniforms, flags, streamers, banners, and accessories, working with the Anointed Seamstress to make any necessary adjustments.</p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Marketing Team</h5>
                      <p>Members report to Director of Marketing (DOM) and work together to support the marketing strategy. Team will assist with reviewing videos, photos, and help devise promotional items under the direction of the DOM.</p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Choreography Team</h5>
                      <p>The team is responsible for the creation and vision of dance choreography and is under the leaders of the Director of Choreography. Members will work in unison to create and teach ministry pieces to the ministry. The team is held at a higher standard to upkeep the vision of choreography. Unless excused by the Director of Choreography, each member of the team is required to attend all external and in-house trainings and workshops.</p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Prayer Ministry Team</h5>
                      <p>The team serves as an intercessory group dedicated to supporting the Spiritual Advisor and the Fresh Fire Dance Ministry through prayer, encouragement, and spiritual covering. This team ensures that prayer remains a foundational aspect of the ministry, fostering a spiritually strong and united dance community. The team regularly prays for the dance ministry, its leadership, members, and any specific needs that arise They also assist the Spiritual Advisor in carrying out prayer initiatives, the devotional calendar, and spiritual encouragement under the direction of the Spiritual Advisor</p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Fresh Fire Flags Worship Team</h5>
                      <p>The Fresh Fire Flags Worship Team serves as the frontline dancers, ministering weekly during church services. Through movement and the use of worship instruments—including flags, banners, tambourines, mattah sticks, and streamers—this team ushers in the presence of God and ministers to His people under the guidance of the Holy Spirit. As a consistent part of worship, team members are committed to executing with excellence, discipline, and spiritual sensitivity. The team operates under the leadership of the Director, along with appointed dancers from the collective ministry, to ensure alignment with the vision and flow of worship.</p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Dance Development Team</h5>
                      <p className="mb-2">The Dance Development Team works under the leadership of the Director of Dance Development to promote the overall well-being and physical conditioning of the ministry's dancers. This team plays a crucial role in maintaining the ministry's standard of excellence by ensuring dancers are physically prepared for movement and ministry.</p>
                      <p className="font-medium mb-1">Responsibilities:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Assist in leading warm-ups before rehearsals, workshops, and production days</li>
                        <li>Support the Director of Dance Development in organizing workouts, in-house conditioning sessions and training programs</li>
                        <li>Provide encouragement and accountability to fellow dancers in maintaining temple stewardship (mind, body, soul, and spirit).</li>
                        <li>Step in as needed to support any function required by the Director of Dance Development.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CLC Worship Arts Covenant */}
          <Card>
            <CardHeader>
              <CardTitle className="text-fire-gradient">CLC Worship Arts Covenant</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <h4 className="font-semibold text-fire-purple mb-2">Romans 12:1-2 (NIV)</h4>
                <blockquote className="italic border-l-4 border-fire-purple pl-4">
                  Therefore, I urge you, brothers and sisters, in view of God's mercy, to offer your
                  bodies as a living sacrifice, holy and pleasing to God—this is your true and
                  proper worship. Do not conform to the pattern of this world but be transformed
                  by the renewing of your mind. Then you will be able to test and approve what
                  God's will is—his good, pleasing and perfect will.
                </blockquote>
              </div>

              <p className="text-center">
                As worshippers we are called to offer our entire lives a living sacrifice that is Holy
                and acceptable unto the Lord. Worship is not just what we do but who we are.
              </p>

              <div className="text-center">
                <h4 className="font-semibold text-fire-magenta mb-2">CLC Vision</h4>
                <p>Experience God | Connect Together | Grow & Serve | Impact our World</p>
                <p className="font-semibold">All 4 One</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-fire-purple mb-2">Honor</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Everyone who participates in Sunday Morning worship must live a life of worship on and off the stage. (James 1:22-25)</li>
                    <li>We are a culture of honor so how we speak must be honoring to one another while we are present among each other and while we are absent from one another. (Psalm 19:14, Psalm 34:12-13)</li>
                    <li>Everyone must be unified in everything we do as a team. (Psalm 133:1; John 17:20-23).</li>
                    <li>We always show up ready to serve with a positive attitude (Colossians 3:23)</li>
                    <li>As worshippers, we believe that we should sit in service and be engaged during the sermon</li>
                    <li>We strive to pick songs that lift up Jesus and are not centered on ourselves</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-fire-magenta mb-2">Reverence</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>When you are on the stage you must dress appropriately. If you are dressed in a way that is not according to the approved attire, you will be asked not to minister with us that weekend. (1 Cor. 6:19-20; 1 Tim. 2:9-10; Matt. 5:28)</li>
                  </ul>
                  
                  <div className="ml-4 mt-3">
                    <p className="font-medium mb-2">Attire (This applies to everyone. Both men and women.):</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>AM Services: Dressy Casual attire with some form of outer layer whether that is a jacket, cardigan or shawl. No Sneakers allowed.
                        <ul className="list-disc list-inside space-y-1 ml-8 mt-1">
                          <li>Tops must cover your shoulders. All dresses and tops must be accompanied with an outer layer</li>
                          <li>All Skirts and dresses must pass below the knees. Dark denim jeans are preferred. No ripped jeans allowed.</li>
                        </ul>
                      </li>
                      <li>PM Services: Dressy Casual Attire, denim and sneakers are allowed</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-amber-700 mb-2">We &gt; Me</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Humility</li>
                    <li>Always be in prayer for the ministry and for the people in the ministry. (1 Thess. 5:17; Eph. 6:18).</li>
                    <li>As servant leaders we do not see any opportunity to serve as beneath us (Matt 23:11).</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-primary mb-2">We are Disciple Makers</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Discipleship is ongoing in the worship ministry</li>
                    <li>All members of the worship attend must have attended an Encounter, completed SOD (or in the process of completion). Worship involves discipleship and community.</li>
                    <li>If you are struggling with anything or walking through a difficult time feel free to speak with the worship Pastor, worship coordinator, or campus ministry assistant. (James 5:13-16; Gal. 6:1-2; Prov. 27:17)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-fire-purple mb-2">We Grow Daily</h4>
                  <h5 className="font-medium mb-2">Stewardship/Excellence</h5>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Every worship team member must have completed the worship team audition process.</li>
                    <li>Not only are we looking for skilled singers/musicians, but we are also looking for those with a heart of worship. We must worship in Spirit & in truth. (John 4:23-24)</li>
                    <li>We must arrive at rehearsal ready and on time so that we can begin promptly. If you cannot make it for any reason, or will be running late, you MUST call the worship coordinator or campus ministry assistant. Communication is key to any successful ministry.</li>
                    <li>If you are scheduled to lead a song for service and show up late/miss rehearsal/or come unprepared without communicating to the worship coordinator or ministry assistant, you will not be able to lead a song for that service.</li>
                    <li>Everyone is required to check and confirm on Planning Center when they are scheduled.</li>
                    <li>Practice at home, Rehearse together, soundcheck briefly</li>
                    <li>We require that everyone has in-ear monitors in order to be in sync with singers and band</li>
                    <li>We value tracks to create a fuller sound to enhance the worship experience</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-fire-magenta mb-2">We Lead the Way</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>We are the first to engage in worship on and off the stage.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-amber-700 mb-2">We Go Beyond</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>We believe in releasing worship leaders to future CLC ministry opportunities</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AboutUs;