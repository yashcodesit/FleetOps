import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar.jsx';
import { StatusPill } from '../components/StatusPill.jsx';
import { ShieldCheck, Truck, Clock, FileSpreadsheet, UserCheck, Activity } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="landing-page">
      <Navbar />

      <header className="hero-landing">
        <div className="wrap-landing hero-grid-landing">
          <div>
            <div className="kicker-landing">Fleet &amp; delivery operations</div>
            <h1 className="hero-title-landing">Every route, every driver, one board.</h1>
            <p className="lede-landing">
              FleetOps gives dispatchers a live view of drivers, vehicles, and deliveries — and gives drivers one clear screen to work from.
            </p>
            <div className="hero-actions-landing">
              <Link to="/login" className="btn btn-signal">Get started free</Link>
              <a href="#how" className="btn btn-ghost">See how it works</a>
            </div>
            <div className="hero-note-landing">
              <span><span className="sw-landing"></span>No credit card required</span>
              <span><span className="sw-landing"></span>Set up in under 10 minutes</span>
            </div>
          </div>

          <div className="board-landing">
            <div className="board-head-landing">
              <div className="t-landing">Today's routes</div>
              <div className="live-landing"><span className="pulse-landing"></span>LIVE</div>
            </div>
            <div className="row-landing">
              <div className="code-landing">RT-142</div>
              <div className="dest-landing">
                Maple &amp; 5th District<span className="sub-landing">Driver: A. Novak</span>
              </div>
              <StatusPill status="in_transit" isDark />
              <div className="eta-landing">ETA 12m</div>
            </div>
            <div className="row-landing">
              <div className="code-landing">RT-138</div>
              <div className="dest-landing">
                Harbor Warehouse<span className="sub-landing">Driver: R. Ibarra</span>
              </div>
              <StatusPill status="delivered" isDark />
              <div className="eta-landing">09:41</div>
            </div>
            <div className="row-landing">
              <div className="code-landing">RT-151</div>
              <div className="dest-landing">
                Northside Retail<span className="sub-landing">Driver: J. Okafor</span>
              </div>
              <StatusPill status="pending" isDark />
              <div className="eta-landing">Dispatch 2:00</div>
            </div>
            <div className="row-landing">
              <div className="code-landing">RT-149</div>
              <div className="dest-landing">
                Unit 4, Riverside<span className="sub-landing">Driver: A. Novak</span>
              </div>
              <StatusPill status="failed" isDark />
              <div className="eta-landing">Retry queued</div>
            </div>
          </div>
        </div>
      </header>

      <div className="strip-landing">
        <div className="wrap-landing strip-inner-landing">
          <div className="label-landing">Built for teams running local delivery &amp; field fleets</div>
          <div className="logos-landing">
            <span>Northline</span>
            <span>Harborway</span>
            <span>Kestrel</span>
            <span>Meridian</span>
          </div>
        </div>
      </div>

      <section className="section-landing" id="features">
        <div className="wrap-landing">
          <div className="section-head-landing">
            <h2>Everything dispatch needs, nothing it doesn't</h2>
            <p>Built around how routes actually get assigned and closed out — not a generic project board bent into shape.</p>
          </div>
          <div className="feature-grid-landing">
            <div className="feature-landing">
              <div className="ic-landing"><Truck size={20} color="#F5A623" /></div>
              <h3>Assign routes in seconds</h3>
              <p>Pair a driver and vehicle to a route, add stops, and it's on their screen instantly.</p>
            </div>
            <div className="feature-landing">
              <div className="ic-landing"><ShieldCheck size={20} color="#1FB6A4" /></div>
              <h3>Proof of delivery, attached</h3>
              <p>Drivers capture a photo at drop-off — it's saved to the delivery record automatically.</p>
            </div>
            <div className="feature-landing">
              <div className="ic-landing"><Activity size={20} color="#F5A623" /></div>
              <h3>One dashboard, full visibility</h3>
              <p>See every driver's status, delayed stops, and daily completion rate at a glance.</p>
            </div>
            <div className="feature-landing">
              <div className="ic-landing"><FileSpreadsheet size={20} color="#1FB6A4" /></div>
              <h3>Export anything</h3>
              <p>Pull a CSV of any date range or driver for accounting, payroll, or client reporting.</p>
            </div>
            <div className="feature-landing">
              <div className="ic-landing"><UserCheck size={20} color="#F5A623" /></div>
              <h3>Role-based access</h3>
              <p>Drivers see only their own stops. Dispatchers see everything. No extra setup.</p>
            </div>
            <div className="feature-landing">
              <div className="ic-landing"><Clock size={20} color="#1FB6A4" /></div>
              <h3>Built-in audit trail</h3>
              <p>Every status change is logged with who made it and when — no guessing later.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-landing" id="how">
        <div className="wrap-landing">
          <div className="section-head-landing">
            <h2>From dispatch to delivered</h2>
            <p>Three steps, no separate systems to reconcile at the end of the day.</p>
          </div>
          <div className="flow-landing">
            <div className="flow-step-landing">
              <span className="num-landing">01</span>
              <h3>Build the route</h3>
              <p>Dispatcher creates a route, assigns a driver and vehicle, and adds stops in order.</p>
            </div>
            <div className="flow-step-landing">
              <span className="num-landing">02</span>
              <h3>Driver runs it</h3>
              <p>The driver opens their screen, sees today's stops, and updates status as they go.</p>
            </div>
            <div className="flow-step-landing">
              <span className="num-landing">03</span>
              <h3>Close it out</h3>
              <p>Delivery is marked complete with a photo attached — dispatch sees it update live.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-landing" id="dashboard">
        <div className="wrap-landing">
          <div className="preview-landing">
            <div className="copy-landing">
              <h2>A dashboard that answers "what's going on" instantly</h2>
              <p>No digging through spreadsheets — completion rate, active drivers, and delayed stops are the first thing you see.</p>
              <Link to="/admin/dashboard" className="btn btn-signal">View the dashboard</Link>
            </div>
            <div className="stat-cards-landing">
              <div className="stat-card-landing"><div className="k">Deliveries today</div><div className="v">128</div></div>
              <div className="stat-card-landing"><div className="k">Completion rate</div><div className="v">94%<small>+3%</small></div></div>
              <div className="stat-card-landing"><div className="k">Active drivers</div><div className="v">17</div></div>
              <div className="stat-card-landing"><div className="k">Delayed stops</div><div className="v">4</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-band-landing">
        <div className="wrap-landing">
          <div className="cta-box-landing">
            <div>
              <h2>Get your fleet on one board today</h2>
              <p>Free to start. No setup fees, no contracts.</p>
            </div>
            <div className="actions-landing">
              <Link to="/login" className="btn btn-primary">Get started free</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer-landing">
        <div className="wrap-landing footer-inner-landing">
          <div className="brand-landing"><span className="dot-landing"></span>FleetOps</div>
          <div className="f-links-landing">
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/driver">Driver view</Link>
            <Link to="/login">Log in</Link>
          </div>
          <div className="copy-landing">© 2026 FleetOps</div>
        </div>
      </footer>
    </div>
  );
};
