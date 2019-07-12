import React from "react";

import * as authClient from "../utils/auth-client";
import * as selectionsClient from "../utils/selections-client";
const SelectionsContext = React.createContext();

class SelectionsProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      inited: false,
      mySelections: [],
      selections: []
    };
  }

  componentDidUpdate = () => {
    console.log("Selection context componentDidUpdate");

    // Eagerly load selections info.
    if (
      this.state.inited === false &&
      this.state.loading === false &&
      authClient.getToken()
    ) {
      console.log("Selection context list them all !!");
      this.setState({ loading: true }, () => {
        selectionsClient.listMine().then(data => {
          this.setState({
            mySelections: data.selections,
            loading: false,
            inited: true
          });
        });
      });
    }
  };

  listMine = () => {
    return selectionsClient.listMine().then(data => {
      console.log("Received my selections list", data);

      this.setState({
        inited: true,
        loading: false,
        mySelections: data.selections
      });
    });
  };

  add = (product_id, selection_id) => {
    this.setState({ loading: true });
    return selectionsClient.add(product_id, selection_id).then(data => {
      console.log("Products added to selection", data);
      this.setState({
        inited: true,
        loading: false,
        mySelections: data.selections
      });
      return data;
    });
  };

  createAndAdd = (product_ids, selection) => {
    this.setState({ loading: true });
    return selectionsClient.create(product_ids, selection).then(data => {
      this.setState({
        inited: true,
        loading: false,
        mySelections: data.selections
      });
      return data;
    });
  };

  render() {
    return (
      <SelectionsContext.Provider
        value={{
          inited: this.state.inited,
          loading: this.state.loading,
          mySelections: this.state.mySelections,
          selections: this.state.selections,
          listMine: this.listMine,
          add: this.add,
          createAndAdd: this.createAndAdd
        }}
        {...this.props}
      />
    );
  }
}

function useSelections() {
  const context = React.useContext(SelectionsContext);
  if (context === undefined) {
    throw new Error(`useSelections must be used within a SelectionsProvider`);
  }
  return context;
}

export { SelectionsProvider, SelectionsContext, useSelections };
