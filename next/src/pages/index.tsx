import React from "react"
import { GetStaticProps } from 'next';
import { MyLayout } from "../components/templates/MyLayout";

type Props = {
  title: string
}

class App extends React.Component<Props> {
  static async getStaticProps(): Promise<GetStaticProps> {
    return { title: "Hello world" }
  }

  render() {
    return (
        <MyLayout>

        </MyLayout>
    )
  }
}

export default App
