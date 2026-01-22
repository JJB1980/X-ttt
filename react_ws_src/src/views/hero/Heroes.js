import React from "react";

import Modal from "./Modal";

class Hero extends React.Component {
  constructor() {
    super();
    this.state = {
      search: "",
      results: [],
      hero: "",
      filtered: null,
      error: null,
      selectedHero: null,
    };
  }

  doSearch(e) {
    const { search } = this.state;
    fetch(`http://0.0.0.0:3000/api/heroes?search=${search}`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          results: data.results || [],
          filtered: null,
          error: null,
        });
      })
      .catch((err) => {
        this.setState({
          error: err.message,
          filtered: null,
        });
      });
  }

  render() {
    return (
      <div>
        {this.state.selectedHero && (
          <Modal
            isOpen={true}
            onClose={() => this.setState({ selectedHero: null })}
            title={this.state.selectedHero.name || "Hero Details"}
          >
            <img
              style={{ width: "10rem" }}
              src={`${this.state.selectedHero.image.url}`}
              alt="Hero"
            />

            <p style={{ paddingTop: "12px" }}>
              Full Name: <i>{this.state.selectedHero.biography["full-name"]}</i>
            </p>
            <p style={{ paddingTop: "12px" }}>
              Aliases:{" "}
              <i>{this.state.selectedHero.biography["aliases"].join(", ")}</i>
            </p>
            <p style={{ paddingTop: "12px" }}>
              First Appearance:{" "}
              <i>{this.state.selectedHero.biography["first-appearance"]}</i>
            </p>
            <p style={{ paddingTop: "12px" }}>
              Publisher: <i>{this.state.selectedHero.biography["publisher"]}</i>
            </p>
          </Modal>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <section style={{ padding: "20px" }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                this.doSearch();
              }}
            >
              <h2>Heroes</h2>
              <br />
              {/* <select
                value={this.state.hero || ""}
                onChange={(e) => this.doSearch(e)}
                placeholder="Search heroes..."
                style={{ width: "100%" }}
              >
                <option value="">-- Select a hero --</option>
                <option value="spiderman">Spiderman</option>
                <option value="batman">Batman</option>
                <option value="superman">Superman</option>
              </select> */}

              <br />
              <br />

              <input
                type="text"
                value={this.state.search || ""}
                onChange={(e) => this.setState({ search: e.target.value })}
                placeholder="Filter heroes..."
              />

              <button type="submit">Search Heros</button>
            </form>
          </section>

          <section style={{ paddingLeft: "20px" }}>
            <br />
            {!this.state.results.length ? (
              "Search your favorite hero!"
            ) : (
              <div>
                {this.state.error && (
                  <div style={{ color: "red" }}>
                    Error fetching heroes: {this.state.error}
                  </div>
                )}
                {(this.state.filtered || this.state.results).map(
                  (hero, index) => (
                    <button
                      key={index}
                      style={{
                        paddingTop: "12px",
                        display: "block",
                        background: "transparent",
                        border: "none",
                        // ":hover": { textDecoration: "underline" },
                        cursor: "pointer",
                      }}
                      type="button"
                      onClick={() => this.setState({ selectedHero: hero })}
                    >
                      {hero.name}
                    </button>
                  ),
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    );
  }
}

export default Hero;
