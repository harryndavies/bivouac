import { Box } from "@mui/material";
import React from "react";

interface IProps {
  point: __esri.Point;
  words: string;
}

export default function Navigate({ point, words }: IProps): JSX.Element {
  return (
    <Box sx={{ p: 2 }}>
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${point.latitude},${point.longitude}`}
        style={{ marginRight: "10px" }}
        target="_blank"
        rel="noreferrer"
      >
        <img
          height={"48px"}
          alt=""
          src="https://cdn.vox-cdn.com/thumbor/pOMbzDvdEWS8NIeUuhxp23wi_cU=/1400x1400/filters:format(png)/cdn.vox-cdn.com/uploads/chorus_asset/file/19700731/googlemaps.png"
        />
      </a>
      <a
        href={`https://www.waze.com/ul?ll=${point.latitude}%2C${point.longitude}&z=17`}
        style={{ marginRight: "18px" }}
        target="_blank"
        rel="noreferrer"
      >
        <img
          height={"48px"}
          alt=""
          style={{ borderRadius: "10px" }}
          src="https://cdn-images-1.medium.com/max/1200/1*3kS1iOOTBrvtkecae3u2aA.png"
        />
      </a>

      <a
        href={`http://citymapper.com/directions?startcoord=&endcoord=${point.latitude}%2C${point.longitude}&endname=%2F%2F%2F${words}`}
        target="_blank"
        rel="noreferrer"
      >
        <img
          height={"48px"}
          alt=""
          style={{ borderRadius: "10px", marginRight: "18px" }}
          src="https://miro.medium.com/max/3150/1*n9jE-NZQ_8kO1TjzJlATNA.png"
        />
      </a>

      <a href={`https://w3w.co/${words}`} target="_blank" rel="noreferrer">
        <img
          height={"48px"}
          alt=""
          style={{ borderRadius: "10px", marginRight: "18px" }}
          src="https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/dhe2b3ydz2dzovjoc2j3"
        />
      </a>

      <a
        href={`http://bing.com/maps/default.aspx?rtp=~pos.${point.latitude}_${point.longitude}`}
        target="_blank"
        rel="noreferrer"
      >
        <img
          height={"48px"}
          alt=""
          style={{ borderRadius: "10px" }}
          src="https://pbs.twimg.com/profile_images/688047615926087680/m33TW6zZ_400x400.png"
        />
      </a>
    </Box>
  );
}
